<?php

declare(strict_types=1);

namespace App\OpenApi;

use BackedEnum;
use DateTimeInterface;
use Dedoc\Scramble\Extensions\TypeToSchemaExtension;
use Dedoc\Scramble\Support\Generator\ClassBasedReference;
use Dedoc\Scramble\Support\Generator\Reference;
use Dedoc\Scramble\Support\Generator\Response;
use Dedoc\Scramble\Support\Generator\Schema;
use Dedoc\Scramble\Support\Generator\Types as OpenApi;
use Dedoc\Scramble\Support\Type\ObjectType;
use Dedoc\Scramble\Support\Type\Type;
use LogicException;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionNamedType;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;

class SpatieDataToSchema extends TypeToSchemaExtension
{
    public function shouldHandle(Type $type): bool
    {
        return $type instanceof ObjectType
            && is_a($type->name, Data::class, true);
    }

    #[\Override]
    public function toSchema(Type $type): OpenApi\Type
    {
        if (! $type instanceof ObjectType || ! is_a($type->name, Data::class, true)) {
            return new OpenApi\UnknownType;
        }

        $schema = new OpenApi\ObjectType;
        $required = [];

        $reflectionClass = new ReflectionClass($type->name);
        $constructor = $reflectionClass->getConstructor();

        foreach ($constructor?->getParameters() ?? [] as $parameter) {
            $parameterType = $parameter->getType();

            if (! $parameterType instanceof ReflectionNamedType) {
                continue;
            }

            $property = $this->schemaForNamedType($parameterType, $reflectionClass, $parameter->getName());

            if ($parameterType->getName() === 'array') {
                $itemsType = $this->collectedDataItems($reflectionClass, $parameter->getName())
                    ?? $this->documentedItems($constructor?->getDocComment(), $parameter->getName());

                if ($itemsType instanceof OpenApi\Type) {
                    $arrayType = new OpenApi\ArrayType;
                    $arrayType->items = $itemsType;
                    $property = $arrayType;
                }
            }

            if ($parameterType->allowsNull()) {
                $property->nullable(true);
            }

            $schema->addProperty($parameter->getName(), $property);

            if (! $parameter->isDefaultValueAvailable()) {
                $required[] = $parameter->getName();
            }
        }

        $schema->setRequired($required);

        return $schema;
    }

    public function reference(ObjectType $type): Reference
    {
        return ClassBasedReference::create('schemas', $type->name, $this->components);
    }

    public function toResponse(Type $type): Response
    {
        $schema = Schema::fromType($this->openApiTransformer->transform($type));

        if (! $schema instanceof Schema) {
            throw new LogicException('Schema::fromType returned an unexpected value.');
        }

        return (new Response(200))->setContent('application/json', $schema);
    }

    /**
     * Items schema for an array property carrying #[DataCollectionOf(SomeData::class)].
     *
     * @param  ReflectionClass<Data>  $reflectionClass
     */
    private function collectedDataItems(ReflectionClass $reflectionClass, string $propertyName): ?OpenApi\Type
    {
        $attribute = $this->firstPropertyAttribute($reflectionClass, $propertyName, DataCollectionOf::class);

        if (! $attribute instanceof ReflectionAttribute) {
            return null;
        }

        return $this->openApiTransformer->transform(new ObjectType($attribute->newInstance()->class));
    }

    /**
     * Items schema for an array of scalars, read off the constructor's `@param`.
     *
     * A list of ids has no Data class to point #[DataCollectionOf] at, and PHP's own
     * `array` type says nothing about what is in it, so the docblock is the only
     * declaration of the item type — without it the generated client sees unknown[].
     */
    private function documentedItems(string|false|null $docComment, string $propertyName): ?OpenApi\Type
    {
        if ($docComment === false || $docComment === null) {
            return null;
        }

        $pattern = sprintf(
            '/@param\s+(?:list<(\w+)>|array<(?:\w+,\s*)?(\w+)>|(\w+)\[])\s+\$%s\b/',
            preg_quote($propertyName, '/'),
        );

        if (preg_match($pattern, $docComment, $matches) !== 1) {
            return null;
        }

        return match (array_values(array_filter(array_slice($matches, 1)))[0] ?? null) {
            'int' => new OpenApi\IntegerType,
            'string' => new OpenApi\StringType,
            'float' => new OpenApi\NumberType,
            'bool' => new OpenApi\BooleanType,
            default => null,
        };
    }

    /**
     * A promoted property's first attribute of the given class, if any.
     *
     * These attributes target properties, so they are read from the promoted
     * property, not the constructor parameter.
     *
     * @template TAttribute of object
     *
     * @param  ReflectionClass<Data>  $reflectionClass
     * @param  class-string<TAttribute>  $attributeClass
     * @return ReflectionAttribute<TAttribute>|null
     */
    private function firstPropertyAttribute(ReflectionClass $reflectionClass, string $propertyName, string $attributeClass): ?ReflectionAttribute
    {
        if (! $reflectionClass->hasProperty($propertyName)) {
            return null;
        }

        return $reflectionClass->getProperty($propertyName)->getAttributes($attributeClass)[0] ?? null;
    }

    /**
     * The date format a property's #[WithTransformer] pins, if any.
     *
     * A property rendered as a calendar day must be documented `format: date`:
     * left as `date-time`, openapi-ts generates `z.iso.datetime()` and the zod
     * schema rejects every response the endpoint actually returns.
     *
     * @param  ReflectionClass<Data>  $reflectionClass
     */
    private function transformerDateFormat(ReflectionClass $reflectionClass, string $propertyName): ?string
    {
        $attribute = $this->firstPropertyAttribute($reflectionClass, $propertyName, WithTransformer::class);

        if (! $attribute instanceof ReflectionAttribute) {
            return null;
        }

        $format = $attribute->getArguments()['format'] ?? null;

        return is_string($format) ? $format : null;
    }

    /**
     * @param  ReflectionClass<Data>  $reflectionClass
     */
    private function schemaForNamedType(ReflectionNamedType $type, ReflectionClass $reflectionClass, string $propertyName): OpenApi\Type
    {
        $name = $type->getName();

        if ($type->isBuiltin()) {
            return match ($name) {
                'string' => new OpenApi\StringType,
                'int' => new OpenApi\IntegerType,
                'float' => new OpenApi\NumberType,
                'bool' => new OpenApi\BooleanType,
                'array' => new OpenApi\ArrayType,
                default => new OpenApi\UnknownType,
            };
        }

        if (is_a($name, Data::class, true) || is_a($name, BackedEnum::class, true)) {
            return $this->openApiTransformer->transform(new ObjectType($name));
        }

        if (is_a($name, DateTimeInterface::class, true)) {
            return (new OpenApi\StringType)->format(
                $this->transformerDateFormat($reflectionClass, $propertyName) === 'Y-m-d' ? 'date' : 'date-time',
            );
        }

        return new OpenApi\UnknownType;
    }
}

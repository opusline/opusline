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
use ReflectionClass;
use ReflectionNamedType;
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

        $constructor = (new ReflectionClass($type->name))->getConstructor();

        foreach ($constructor?->getParameters() ?? [] as $parameter) {
            $parameterType = $parameter->getType();

            if (! $parameterType instanceof ReflectionNamedType) {
                continue;
            }

            $property = $this->schemaForNamedType($parameterType);

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

    private function schemaForNamedType(ReflectionNamedType $type): OpenApi\Type
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
            return (new OpenApi\StringType)->format('date-time');
        }

        return new OpenApi\UnknownType;
    }
}

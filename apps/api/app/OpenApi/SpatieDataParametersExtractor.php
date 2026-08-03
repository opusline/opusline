<?php

declare(strict_types=1);

namespace App\OpenApi;

use Dedoc\Scramble\Support\Generator\Parameter;
use Dedoc\Scramble\Support\Generator\TypeTransformer;
use Dedoc\Scramble\Support\OperationExtensions\ParameterExtractor\ParameterExtractor;
use Dedoc\Scramble\Support\OperationExtensions\RequestBodyExtension;
use Dedoc\Scramble\Support\OperationExtensions\RulesExtractor\DeepParametersMerger;
use Dedoc\Scramble\Support\OperationExtensions\RulesExtractor\GeneratesParametersFromRules;
use Dedoc\Scramble\Support\OperationExtensions\RulesExtractor\ParametersExtractionResult;
use Dedoc\Scramble\Support\RouteInfo;
use ReflectionNamedType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\DataConfig;

class SpatieDataParametersExtractor implements ParameterExtractor
{
    use GeneratesParametersFromRules;

    public function __construct(
        private readonly TypeTransformer $openApiTransformer,
        private readonly DataConfig $dataConfig,
    ) {}

    public function handle(RouteInfo $routeInfo, array $parameterExtractionResults): array
    {
        $dataClassName = $this->requestDataClassName($routeInfo);

        if ($dataClassName === null) {
            return $parameterExtractionResults;
        }

        $parameters = $this->makeParameters(
            rules: $dataClassName::getValidationRules($this->fullPayload($dataClassName)),
            typeTransformer: $this->openApiTransformer,
            in: in_array(mb_strtolower($routeInfo->method), RequestBodyExtension::HTTP_METHODS_WITHOUT_REQUEST_BODY, true)
                ? 'query'
                : 'body',
        );

        $parameterExtractionResults[] = new ParametersExtractionResult(
            parameters: $this->correctNestedDataOptionality($dataClassName, $parameters),
            schemaName: class_basename($dataClassName),
            sourceClass: $dataClassName,
        );

        return $parameterExtractionResults;
    }

    /**
     * @return ?class-string<Data>
     */
    private function requestDataClassName(RouteInfo $routeInfo): ?string
    {
        $reflectionAction = $routeInfo->reflectionAction();

        if ($reflectionAction === null) {
            return null;
        }

        foreach ($reflectionAction->getParameters() as $reflectionParameter) {
            $parameterType = $reflectionParameter->getType();

            if ($parameterType instanceof ReflectionNamedType && is_a($parameterType->getName(), Data::class, true)) {
                /** @var class-string<Data> */
                return $parameterType->getName();
            }
        }

        return null;
    }

    /**
     * Rules are resolved against a payload where nested data is always
     * present, so Scramble's dot-path merge would mark nullable nested
     * objects as required. Merge here and restore their real optionality.
     *
     * @param  class-string<Data>  $dataClassName
     * @param  Parameter[]  $parameters
     * @return Parameter[]
     */
    private function correctNestedDataOptionality(string $dataClassName, array $parameters): array
    {
        $parameters = (new DeepParametersMerger(collect($parameters)))->handle();

        foreach ($this->dataConfig->getDataClass($dataClassName)->properties as $property) {
            $kind = $property->type->kind;

            if (! $kind->isDataObject() && ! $kind->isDataCollectable()) {
                continue;
            }

            $inputName = $property->inputMappedName ?? $property->name;

            foreach ($parameters as $parameter) {
                if ($parameter->name !== $inputName) {
                    continue;
                }

                if ($property->type->isNullable) {
                    $parameter->schema?->type->nullable(true);
                }

                if ($property->type->isNullable || $property->type->isOptional || $property->hasDefaultValue) {
                    $parameter->required(false);
                }
            }
        }

        return $parameters;
    }

    /**
     * laravel-data omits rules for absent properties that have defaults and
     * skips nested rules for absent nested data, so resolve against a payload
     * where every property is present (nested data as arrays).
     *
     * @param  class-string<Data>  $dataClassName
     * @return array<string, null|array{}>
     */
    private function fullPayload(string $dataClassName): array
    {
        $payload = [];

        foreach ($this->dataConfig->getDataClass($dataClassName)->properties as $property) {
            $inputName = $property->inputMappedName ?? $property->name;

            $payload[$inputName] = $property->type->kind->isDataObject() || $property->type->kind->isDataCollectable()
                ? []
                : null;
        }

        return $payload;
    }
}

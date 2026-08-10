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
use Illuminate\Support\Arr;
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

        $rules = $dataClassName::getValidationRules($this->fullPayload($dataClassName));

        $parameters = $this->makeParameters(
            rules: $rules,
            typeTransformer: $this->openApiTransformer,
            in: in_array(mb_strtolower($routeInfo->method), RequestBodyExtension::HTTP_METHODS_WITHOUT_REQUEST_BODY, true)
                ? 'query'
                : 'body',
        );

        $parameterExtractionResults[] = new ParametersExtractionResult(
            parameters: $this->correctNestedDataOptionality($dataClassName, $parameters, $rules),
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
     * Rules are resolved against a payload where every property is present,
     * so Scramble would mark nullable nested objects and defaulted properties
     * as required. Merge here and restore their real optionality.
     *
     * @param  class-string<Data>  $dataClassName
     * @param  Parameter[]  $parameters
     * @param  array<string, mixed>  $rules
     * @return Parameter[]
     */
    private function correctNestedDataOptionality(string $dataClassName, array $parameters, array $rules): array
    {
        $parameters = (new DeepParametersMerger(collect($parameters)))->handle();

        foreach ($this->dataConfig->getDataClass($dataClassName)->properties as $property) {
            $kind = $property->type->kind;
            $inputName = $property->inputMappedName ?? $property->name;

            foreach ($parameters as $parameter) {
                if ($parameter->name !== $inputName) {
                    continue;
                }

                if (($kind->isDataObject() || $kind->isDataCollectable()) && $property->type->isNullable) {
                    $parameter->schema?->type->nullable(true);
                }

                // Nullable is not the same as optional: `present` demands the
                // key even when null is a legal value for it. Only `present`
                // counts — `required` is inferred for every defaulted property
                // under the full payload above, so it proves nothing here.
                if (! $property->hasDefaultValue && $this->rulesDemandTheKey($rules[$inputName] ?? [])) {
                    continue;
                }

                if ($property->type->isNullable || $property->type->isOptional || $property->hasDefaultValue) {
                    $parameter->required(false);
                }
            }
        }

        return $parameters;
    }

    /**
     * Whether the resolved rules insist the key appears in the payload.
     */
    private function rulesDemandTheKey(mixed $rules): bool
    {
        foreach (Arr::wrap($rules) as $rule) {
            if (is_string($rule) && $rule === 'present') {
                return true;
            }
        }

        return false;
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

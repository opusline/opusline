<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Illuminate\Support\Str;
use Illuminate\Validation\Validator;

class LocalizedValidator extends Validator
{
    /**
     * @param  string  $name
     */
    #[\Override]
    protected function getAttributeFromTranslations($name): ?string
    {
        $candidates = array_unique([$name, Str::afterLast($name, '.')]);

        foreach ($candidates as $candidate) {
            if ($this->translator->has($key = 'fields.'.$candidate)) {
                return $this->translator->get($key);
            }
        }

        foreach ($candidates as $candidate) {
            $stockName = parent::getAttributeFromTranslations(Str::snake($candidate));

            if ($stockName !== null) {
                return $stockName;
            }
        }

        return null;
    }
}

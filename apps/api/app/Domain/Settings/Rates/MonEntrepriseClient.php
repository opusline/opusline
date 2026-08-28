<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

/**
 * Reads the official barème from mon-entreprise, the URSSAF-run rules engine
 * behind autoentrepreneur.urssaf.fr.
 *
 * @see https://mon-entreprise.urssaf.fr/api/v1/doc
 * @see https://github.com/betagouv/mon-entreprise
 */
class MonEntrepriseClient
{
    /**
     * Pinned against the live API. mon-entreprise tags several of the rules
     * these lean on as experimental — they may be renamed without a major
     * version — so a shape change must fail loudly here rather than quietly
     * produce a wrong rate.
     */
    private const string CONTRIBUTION_RATE = 'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux';

    private const string LIBERATING_PAYMENT_AMOUNT = 'dirigeant . auto-entrepreneur . impôt . versement libératoire . montant';

    /**
     * @param  bool  $retryTransientFailures  Set only for « Vérifier maintenant »,
     *                                        where the user asked for this round-trip
     *                                        and is watching it. A settings save also
     *                                        reaches here, as a side effect of pressing
     *                                        Enregistrer: retrying a timeout there turns
     *                                        a ~10 s worst case into ~20 s on an
     *                                        interactive request, and the caller already
     *                                        degrades gracefully to « saved without
     *                                        re-reading the barème ».
     *
     * @throws RatesUnavailable
     */
    public function fetch(RateSituation $situation, bool $retryTransientFailures = false): OfficialRates
    {
        if (! config()->boolean('services.mon_entreprise.enabled')) {
            throw new RatesUnavailable('The official rate source is disabled.');
        }

        $probeRevenue = config()->integer('fiscality.liberating_payment_probe_revenue');

        $request = Http::baseUrl(config()->string('services.mon_entreprise.url'))
            ->timeout(config()->integer('services.mon_entreprise.timeout'))
            ->acceptJson();

        if ($retryTransientFailures) {
            $request = $request->retry(2, 200, throw: false);
        }

        try {
            $response = $request
                ->post('/evaluate', [
                    'expressions' => [self::CONTRIBUTION_RATE, self::LIBERATING_PAYMENT_AMOUNT],
                    'situation' => [
                        ...$situation->toArray(),
                        'dirigeant . auto-entrepreneur . impôt . versement libératoire' => 'oui',
                        "entreprise . chiffre d'affaires . service BNC" => "{$probeRevenue} €/an",
                    ],
                ]);
        } catch (ConnectionException $exception) {
            throw new RatesUnavailable('Could not reach the official rate source.', $exception->getCode(), previous: $exception);
        }

        if ($response->failed()) {
            throw new RatesUnavailable("The official rate source answered {$response->status()}.");
        }

        $readAt = CarbonImmutable::now();

        return new OfficialRates(
            contributionRateBp: $this->percentToBasisPoints($response, 0),
            liberatingPaymentRateBp: $this->amountToBasisPoints($response, 1, $probeRevenue),
            year: $readAt->year,
            readAt: $readAt,
        );
    }

    private function percentToBasisPoints(Response $response, int $index): int
    {
        return (int) round($this->value($response, $index) * 100);
    }

    /**
     * The engine exposes no rate for the versement libératoire — the
     * percentages live inline in its `montant` rule — so it is measured
     * against a known revenue instead: 220 € on 10 000 € is 2,20 %.
     */
    private function amountToBasisPoints(Response $response, int $index, int $probeRevenue): int
    {
        return (int) round($this->value($response, $index) / $probeRevenue * 10_000);
    }

    private function value(Response $response, int $index): float
    {
        $value = $response->json("evaluate.{$index}.nodeValue");

        // Several of the rules behind these expressions are tagged experimental
        // upstream, so a renamed one shows up here as a missing value.
        if (! is_numeric($value)) {
            throw new RatesUnavailable('The official rate source returned no value for a rate.');
        }

        return (float) $value;
    }
}

/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown>, share: NonNullable<unknown>, amount: NonNullable<unknown> }} Subscriptions_Regime_ShareInputs */

const en_subscriptions_regime_share = /** @type {(inputs: Subscriptions_Regime_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} · ${i?.share} of ${i?.amount}`)
};

const fr_subscriptions_regime_share = /** @type {(inputs: Subscriptions_Regime_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rate} · ${i?.share} de ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "{rate} · {share} of {amount}" |
*
* @param {Subscriptions_Regime_ShareInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_regime_share = /** @type {((inputs: Subscriptions_Regime_ShareInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Regime_ShareInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_regime_share(inputs)
	return en_subscriptions_regime_share(inputs)
});
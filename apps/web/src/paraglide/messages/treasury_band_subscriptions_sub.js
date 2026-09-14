/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Treasury_Band_Subscriptions_SubInputs */

const en_treasury_band_subscriptions_sub = /** @type {(inputs: Treasury_Band_Subscriptions_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`built up monthly · next debit ${i?.date}`)
};

const fr_treasury_band_subscriptions_sub = /** @type {(inputs: Treasury_Band_Subscriptions_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`constituée mois par mois · prochain prélèvement le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "built up monthly · next debit {date}" |
*
* @param {Treasury_Band_Subscriptions_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_subscriptions_sub = /** @type {((inputs: Treasury_Band_Subscriptions_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_Subscriptions_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_subscriptions_sub(inputs)
	return en_treasury_band_subscriptions_sub(inputs)
});
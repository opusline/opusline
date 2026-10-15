/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payment_Terms_Days_SuffixInputs */

const en_payment_terms_days_suffix = /** @type {(inputs: Payment_Terms_Days_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`days`)
};

const fr_payment_terms_days_suffix = /** @type {(inputs: Payment_Terms_Days_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`jours`)
};

/**
* | output |
* | --- |
* | "days" |
*
* @param {Payment_Terms_Days_SuffixInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payment_terms_days_suffix = /** @type {((inputs?: Payment_Terms_Days_SuffixInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payment_Terms_Days_SuffixInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payment_terms_days_suffix(inputs)
	return en_payment_terms_days_suffix(inputs)
});
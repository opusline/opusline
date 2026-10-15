/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payment_Terms_OtherInputs */

const en_payment_terms_other = /** @type {(inputs: Payment_Terms_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other…`)
};

const fr_payment_terms_other = /** @type {(inputs: Payment_Terms_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autre…`)
};

/**
* | output |
* | --- |
* | "Other…" |
*
* @param {Payment_Terms_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payment_terms_other = /** @type {((inputs?: Payment_Terms_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payment_Terms_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payment_terms_other(inputs)
	return en_payment_terms_other(inputs)
});
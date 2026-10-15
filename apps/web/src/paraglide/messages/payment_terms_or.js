/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payment_Terms_OrInputs */

const en_payment_terms_or = /** @type {(inputs: Payment_Terms_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`or`)
};

const fr_payment_terms_or = /** @type {(inputs: Payment_Terms_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ou`)
};

/**
* | output |
* | --- |
* | "or" |
*
* @param {Payment_Terms_OrInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payment_terms_or = /** @type {((inputs?: Payment_Terms_OrInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payment_Terms_OrInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payment_terms_or(inputs)
	return en_payment_terms_or(inputs)
});
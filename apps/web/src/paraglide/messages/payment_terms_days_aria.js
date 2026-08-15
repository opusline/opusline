/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payment_Terms_Days_AriaInputs */

const en_payment_terms_days_aria = /** @type {(inputs: Payment_Terms_Days_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment terms in days`)
};

const fr_payment_terms_days_aria = /** @type {(inputs: Payment_Terms_Days_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement en jours`)
};

/**
* | output |
* | --- |
* | "Payment terms in days" |
*
* @param {Payment_Terms_Days_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payment_terms_days_aria = /** @type {((inputs?: Payment_Terms_Days_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payment_Terms_Days_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payment_terms_days_aria(inputs)
	return en_payment_terms_days_aria(inputs)
});
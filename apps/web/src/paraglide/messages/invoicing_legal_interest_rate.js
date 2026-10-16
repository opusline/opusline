/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Interest_RateInputs */

const en_invoicing_legal_interest_rate = /** @type {(inputs: Invoicing_Legal_Interest_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legal interest rate, professional creditor`)
};

const fr_invoicing_legal_interest_rate = /** @type {(inputs: Invoicing_Legal_Interest_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux d'intérêt légal, créancier professionnel`)
};

/**
* | output |
* | --- |
* | "Legal interest rate, professional creditor" |
*
* @param {Invoicing_Legal_Interest_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_interest_rate = /** @type {((inputs?: Invoicing_Legal_Interest_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Interest_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_interest_rate(inputs)
	return en_invoicing_legal_interest_rate(inputs)
});
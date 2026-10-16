/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Statutory_RateInputs */

const en_invoicing_legal_statutory_rate = /** @type {(inputs: Invoicing_Legal_Statutory_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rate applied with no clause (ECB + 10 pts)`)
};

const fr_invoicing_legal_statutory_rate = /** @type {(inputs: Invoicing_Legal_Statutory_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux appliqué sans clause (BCE + 10 pts)`)
};

/**
* | output |
* | --- |
* | "Rate applied with no clause (ECB + 10 pts)" |
*
* @param {Invoicing_Legal_Statutory_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_statutory_rate = /** @type {((inputs?: Invoicing_Legal_Statutory_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Statutory_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_statutory_rate(inputs)
	return en_invoicing_legal_statutory_rate(inputs)
});
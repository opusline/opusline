/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Maximum_TermInputs */

const en_invoicing_legal_maximum_term = /** @type {(inputs: Invoicing_Legal_Maximum_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Longest agreed term`)
};

const fr_invoicing_legal_maximum_term = /** @type {(inputs: Invoicing_Legal_Maximum_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai maximum convenu`)
};

/**
* | output |
* | --- |
* | "Longest agreed term" |
*
* @param {Invoicing_Legal_Maximum_TermInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_maximum_term = /** @type {((inputs?: Invoicing_Legal_Maximum_TermInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Maximum_TermInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_maximum_term(inputs)
	return en_invoicing_legal_maximum_term(inputs)
});
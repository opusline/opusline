/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Term_Without_ClauseInputs */

const en_invoicing_legal_term_without_clause = /** @type {(inputs: Invoicing_Legal_Term_Without_ClauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Term with no clause`)
};

const fr_invoicing_legal_term_without_clause = /** @type {(inputs: Invoicing_Legal_Term_Without_ClauseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai sans clause`)
};

/**
* | output |
* | --- |
* | "Term with no clause" |
*
* @param {Invoicing_Legal_Term_Without_ClauseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_term_without_clause = /** @type {((inputs?: Invoicing_Legal_Term_Without_ClauseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Term_Without_ClauseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_term_without_clause(inputs)
	return en_invoicing_legal_term_without_clause(inputs)
});
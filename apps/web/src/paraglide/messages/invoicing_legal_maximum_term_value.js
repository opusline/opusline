/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Maximum_Term_ValueInputs */

const en_invoicing_legal_maximum_term_value = /** @type {(inputs: Invoicing_Legal_Maximum_Term_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`60 days net or 45 days end of month`)
};

const fr_invoicing_legal_maximum_term_value = /** @type {(inputs: Invoicing_Legal_Maximum_Term_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`60 j nets ou 45 j fin de mois`)
};

/**
* | output |
* | --- |
* | "60 days net or 45 days end of month" |
*
* @param {Invoicing_Legal_Maximum_Term_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_maximum_term_value = /** @type {((inputs?: Invoicing_Legal_Maximum_Term_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Maximum_Term_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_maximum_term_value(inputs)
	return en_invoicing_legal_maximum_term_value(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ term: NonNullable<unknown> }} Invoicing_Term_Legal_MaximumInputs */

const en_invoicing_term_legal_maximum = /** @type {(inputs: Invoicing_Term_Legal_MaximumInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.term} (legal maximum)`)
};

const fr_invoicing_term_legal_maximum = /** @type {(inputs: Invoicing_Term_Legal_MaximumInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.term} (maximum légal)`)
};

/**
* | output |
* | --- |
* | "{term} (legal maximum)" |
*
* @param {Invoicing_Term_Legal_MaximumInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_term_legal_maximum = /** @type {((inputs: Invoicing_Term_Legal_MaximumInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Term_Legal_MaximumInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_term_legal_maximum(inputs)
	return en_invoicing_term_legal_maximum(inputs)
});
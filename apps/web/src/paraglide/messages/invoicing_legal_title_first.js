/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Invoicing_Legal_Title_FirstInputs */

const en_invoicing_legal_title_first = /** @type {(inputs: Invoicing_Legal_Title_FirstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Legal reference · first half of ${i?.year}`)
};

const fr_invoicing_legal_title_first = /** @type {(inputs: Invoicing_Legal_Title_FirstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Référentiel légal · 1er semestre ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Legal reference · first half of {year}" |
*
* @param {Invoicing_Legal_Title_FirstInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_title_first = /** @type {((inputs: Invoicing_Legal_Title_FirstInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Title_FirstInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_title_first(inputs)
	return en_invoicing_legal_title_first(inputs)
});
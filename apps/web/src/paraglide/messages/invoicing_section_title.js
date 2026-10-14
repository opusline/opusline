/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Section_TitleInputs */

const en_invoicing_section_title = /** @type {(inputs: Invoicing_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoicing`)
};

const fr_invoicing_section_title = /** @type {(inputs: Invoicing_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation`)
};

/**
* | output |
* | --- |
* | "Invoicing" |
*
* @param {Invoicing_Section_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_section_title = /** @type {((inputs?: Invoicing_Section_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Section_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_section_title(inputs)
	return en_invoicing_section_title(inputs)
});
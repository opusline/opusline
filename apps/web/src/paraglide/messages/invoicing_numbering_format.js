/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Numbering_FormatInputs */

const en_invoicing_numbering_format = /** @type {(inputs: Invoicing_Numbering_FormatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change the format`)
};

const fr_invoicing_numbering_format = /** @type {(inputs: Invoicing_Numbering_FormatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer le format`)
};

/**
* | output |
* | --- |
* | "Change the format" |
*
* @param {Invoicing_Numbering_FormatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_numbering_format = /** @type {((inputs?: Invoicing_Numbering_FormatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Numbering_FormatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_numbering_format(inputs)
	return en_invoicing_numbering_format(inputs)
});
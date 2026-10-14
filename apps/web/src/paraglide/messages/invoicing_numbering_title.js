/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Numbering_TitleInputs */

const en_invoicing_numbering_title = /** @type {(inputs: Invoicing_Numbering_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Numbering`)
};

const fr_invoicing_numbering_title = /** @type {(inputs: Invoicing_Numbering_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Numérotation`)
};

/**
* | output |
* | --- |
* | "Numbering" |
*
* @param {Invoicing_Numbering_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_numbering_title = /** @type {((inputs?: Invoicing_Numbering_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Numbering_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_numbering_title(inputs)
	return en_invoicing_numbering_title(inputs)
});
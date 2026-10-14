/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_VatInputs */

const en_editor_line_vat = /** @type {(inputs: Editor_Line_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT`)
};

const fr_editor_line_vat = /** @type {(inputs: Editor_Line_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

/**
* | output |
* | --- |
* | "VAT" |
*
* @param {Editor_Line_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_vat = /** @type {((inputs?: Editor_Line_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_vat(inputs)
	return en_editor_line_vat(inputs)
});
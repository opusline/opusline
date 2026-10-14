/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_QuantityInputs */

const en_editor_line_quantity = /** @type {(inputs: Editor_Line_QuantityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Qty`)
};

const fr_editor_line_quantity = /** @type {(inputs: Editor_Line_QuantityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Qté`)
};

/**
* | output |
* | --- |
* | "Qty" |
*
* @param {Editor_Line_QuantityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_quantity = /** @type {((inputs?: Editor_Line_QuantityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_QuantityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_quantity(inputs)
	return en_editor_line_quantity(inputs)
});
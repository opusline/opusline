/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Line_PriceInputs */

const en_editor_line_price = /** @type {(inputs: Editor_Line_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit price before tax`)
};

const fr_editor_line_price = /** @type {(inputs: Editor_Line_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PU HT`)
};

/**
* | output |
* | --- |
* | "Unit price before tax" |
*
* @param {Editor_Line_PriceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_line_price = /** @type {((inputs?: Editor_Line_PriceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Line_PriceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_line_price(inputs)
	return en_editor_line_price(inputs)
});
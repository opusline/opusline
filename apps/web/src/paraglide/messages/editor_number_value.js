/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Number_ValueInputs */

const en_editor_number_value = /** @type {(inputs: Editor_Number_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`on validation`)
};

const fr_editor_number_value = /** @type {(inputs: Editor_Number_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`à la validation`)
};

/**
* | output |
* | --- |
* | "on validation" |
*
* @param {Editor_Number_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_number_value = /** @type {((inputs?: Editor_Number_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Number_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_number_value(inputs)
	return en_editor_number_value(inputs)
});
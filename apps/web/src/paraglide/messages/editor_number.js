/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_NumberInputs */

const en_editor_number = /** @type {(inputs: Editor_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Number`)
};

const fr_editor_number = /** @type {(inputs: Editor_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Numéro`)
};

/**
* | output |
* | --- |
* | "Number" |
*
* @param {Editor_NumberInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_number = /** @type {((inputs?: Editor_NumberInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_NumberInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_number(inputs)
	return en_editor_number(inputs)
});
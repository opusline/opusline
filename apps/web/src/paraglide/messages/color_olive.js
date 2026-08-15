/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_OliveInputs */

const en_color_olive = /** @type {(inputs: Color_OliveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Olive`)
};

const fr_color_olive = /** @type {(inputs: Color_OliveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Olive`)
};

/**
* | output |
* | --- |
* | "Olive" |
*
* @param {Color_OliveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_olive = /** @type {((inputs?: Color_OliveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_OliveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_olive(inputs)
	return en_color_olive(inputs)
});
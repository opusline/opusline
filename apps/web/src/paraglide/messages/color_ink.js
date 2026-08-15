/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_InkInputs */

const en_color_ink = /** @type {(inputs: Color_InkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ink`)
};

const fr_color_ink = /** @type {(inputs: Color_InkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encre`)
};

/**
* | output |
* | --- |
* | "Ink" |
*
* @param {Color_InkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_ink = /** @type {((inputs?: Color_InkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_InkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_ink(inputs)
	return en_color_ink(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_StoneInputs */

const en_color_stone = /** @type {(inputs: Color_StoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stone`)
};

const fr_color_stone = /** @type {(inputs: Color_StoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pierre`)
};

/**
* | output |
* | --- |
* | "Stone" |
*
* @param {Color_StoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_stone = /** @type {((inputs?: Color_StoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_StoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_stone(inputs)
	return en_color_stone(inputs)
});
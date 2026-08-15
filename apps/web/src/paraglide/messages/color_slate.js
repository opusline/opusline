/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_SlateInputs */

const en_color_slate = /** @type {(inputs: Color_SlateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Slate`)
};

const fr_color_slate = /** @type {(inputs: Color_SlateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ardoise`)
};

/**
* | output |
* | --- |
* | "Slate" |
*
* @param {Color_SlateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_slate = /** @type {((inputs?: Color_SlateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_SlateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_slate(inputs)
	return en_color_slate(inputs)
});
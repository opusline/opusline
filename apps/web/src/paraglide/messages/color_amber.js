/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_AmberInputs */

const en_color_amber = /** @type {(inputs: Color_AmberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amber`)
};

const fr_color_amber = /** @type {(inputs: Color_AmberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ambre`)
};

/**
* | output |
* | --- |
* | "Amber" |
*
* @param {Color_AmberInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_amber = /** @type {((inputs?: Color_AmberInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_AmberInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_amber(inputs)
	return en_color_amber(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_SageInputs */

const en_color_sage = /** @type {(inputs: Color_SageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sage`)
};

const fr_color_sage = /** @type {(inputs: Color_SageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauge`)
};

/**
* | output |
* | --- |
* | "Sage" |
*
* @param {Color_SageInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_sage = /** @type {((inputs?: Color_SageInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_SageInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_sage(inputs)
	return en_color_sage(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_PlumInputs */

const en_color_plum = /** @type {(inputs: Color_PlumInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Plum`)
};

const fr_color_plum = /** @type {(inputs: Color_PlumInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prune`)
};

/**
* | output |
* | --- |
* | "Plum" |
*
* @param {Color_PlumInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_plum = /** @type {((inputs?: Color_PlumInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_PlumInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_plum(inputs)
	return en_color_plum(inputs)
});
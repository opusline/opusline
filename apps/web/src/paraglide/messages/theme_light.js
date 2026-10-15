/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_LightInputs */

const en_theme_light = /** @type {(inputs: Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Light`)
};

const fr_theme_light = /** @type {(inputs: Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clair`)
};

/**
* | output |
* | --- |
* | "Light" |
*
* @param {Theme_LightInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const theme_light = /** @type {((inputs?: Theme_LightInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_LightInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_light(inputs)
	return en_theme_light(inputs)
});
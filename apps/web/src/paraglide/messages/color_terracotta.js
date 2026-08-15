/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Color_TerracottaInputs */

const en_color_terracotta = /** @type {(inputs: Color_TerracottaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terracotta`)
};

const fr_color_terracotta = /** @type {(inputs: Color_TerracottaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terracotta`)
};

/**
* | output |
* | --- |
* | "Terracotta" |
*
* @param {Color_TerracottaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const color_terracotta = /** @type {((inputs?: Color_TerracottaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Color_TerracottaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_color_terracotta(inputs)
	return en_color_terracotta(inputs)
});
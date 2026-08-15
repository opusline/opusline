/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_ChooseInputs */

const en_theme_choose = /** @type {(inputs: Theme_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose the theme`)
};

const fr_theme_choose = /** @type {(inputs: Theme_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir le thème`)
};

/**
* | output |
* | --- |
* | "Choose the theme" |
*
* @param {Theme_ChooseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const theme_choose = /** @type {((inputs?: Theme_ChooseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_ChooseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_choose(inputs)
	return en_theme_choose(inputs)
});
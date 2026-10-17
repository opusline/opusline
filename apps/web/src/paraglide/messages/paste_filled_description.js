/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Filled_DescriptionInputs */

const en_paste_filled_description = /** @type {(inputs: Paste_Filled_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description`)
};

const fr_paste_filled_description = /** @type {(inputs: Paste_Filled_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description`)
};

/**
* | output |
* | --- |
* | "Description" |
*
* @param {Paste_Filled_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_description = /** @type {((inputs?: Paste_Filled_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_description(inputs)
	return en_paste_filled_description(inputs)
});
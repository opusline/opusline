/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Filled_PrefixInputs */

const en_paste_filled_prefix = /** @type {(inputs: Paste_Filled_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filled from the text:`)
};

const fr_paste_filled_prefix = /** @type {(inputs: Paste_Filled_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rempli depuis le texte :`)
};

/**
* | output |
* | --- |
* | "Filled from the text:" |
*
* @param {Paste_Filled_PrefixInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_prefix = /** @type {((inputs?: Paste_Filled_PrefixInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_PrefixInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_prefix(inputs)
	return en_paste_filled_prefix(inputs)
});
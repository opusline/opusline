/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Filled_SuffixInputs */

const en_paste_filled_suffix = /** @type {(inputs: Paste_Filled_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· check before validating`)
};

const fr_paste_filled_suffix = /** @type {(inputs: Paste_Filled_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· vérifiez avant de valider`)
};

/**
* | output |
* | --- |
* | "· check before validating" |
*
* @param {Paste_Filled_SuffixInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_suffix = /** @type {((inputs?: Paste_Filled_SuffixInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_SuffixInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_suffix(inputs)
	return en_paste_filled_suffix(inputs)
});
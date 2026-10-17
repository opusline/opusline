/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Sample_TitleInputs */

const en_paste_sample_title = /** @type {(inputs: Paste_Sample_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer area redesign`)
};

const fr_paste_sample_title = /** @type {(inputs: Paste_Sample_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refonte de l'espace client`)
};

/**
* | output |
* | --- |
* | "Customer area redesign" |
*
* @param {Paste_Sample_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_sample_title = /** @type {((inputs?: Paste_Sample_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Sample_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_sample_title(inputs)
	return en_paste_sample_title(inputs)
});
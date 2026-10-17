/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Sample_DevelopmentInputs */

const en_paste_sample_development = /** @type {(inputs: Paste_Sample_DevelopmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Development of the account and orders screens`)
};

const fr_paste_sample_development = /** @type {(inputs: Paste_Sample_DevelopmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Développement des écrans compte et commandes`)
};

/**
* | output |
* | --- |
* | "Development of the account and orders screens" |
*
* @param {Paste_Sample_DevelopmentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_sample_development = /** @type {((inputs?: Paste_Sample_DevelopmentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Sample_DevelopmentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_sample_development(inputs)
	return en_paste_sample_development(inputs)
});
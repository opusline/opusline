/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Ph_DescriptionInputs */

const en_paste_prompt_ph_description = /** @type {(inputs: Paste_Prompt_Ph_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Context in one or two sentences (optional)`)
};

const fr_paste_prompt_ph_description = /** @type {(inputs: Paste_Prompt_Ph_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contexte en une ou deux phrases (facultatif)`)
};

/**
* | output |
* | --- |
* | "Context in one or two sentences (optional)" |
*
* @param {Paste_Prompt_Ph_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_ph_description = /** @type {((inputs?: Paste_Prompt_Ph_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Ph_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_ph_description(inputs)
	return en_paste_prompt_ph_description(inputs)
});
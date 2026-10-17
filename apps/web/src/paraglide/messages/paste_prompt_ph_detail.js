/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Ph_DetailInputs */

const en_paste_prompt_ph_detail = /** @type {(inputs: Paste_Prompt_Ph_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What is included, one idea per line (optional)`)
};

const fr_paste_prompt_ph_detail = /** @type {(inputs: Paste_Prompt_Ph_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce qui est inclus, une idée par ligne (facultatif)`)
};

/**
* | output |
* | --- |
* | "What is included, one idea per line (optional)" |
*
* @param {Paste_Prompt_Ph_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_ph_detail = /** @type {((inputs?: Paste_Prompt_Ph_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Ph_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_ph_detail(inputs)
	return en_paste_prompt_ph_detail(inputs)
});
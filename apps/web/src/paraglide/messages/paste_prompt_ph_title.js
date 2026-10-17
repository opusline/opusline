/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Ph_TitleInputs */

const en_paste_prompt_ph_title = /** @type {(inputs: Paste_Prompt_Ph_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Short title of the document`)
};

const fr_paste_prompt_ph_title = /** @type {(inputs: Paste_Prompt_Ph_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Titre court du document`)
};

/**
* | output |
* | --- |
* | "Short title of the document" |
*
* @param {Paste_Prompt_Ph_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_ph_title = /** @type {((inputs?: Paste_Prompt_Ph_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Ph_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_ph_title(inputs)
	return en_paste_prompt_ph_title(inputs)
});
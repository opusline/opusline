/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Copy_PromptInputs */

const en_paste_copy_prompt = /** @type {(inputs: Paste_Copy_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the prompt`)
};

const fr_paste_copy_prompt = /** @type {(inputs: Paste_Copy_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier le prompt`)
};

/**
* | output |
* | --- |
* | "Copy the prompt" |
*
* @param {Paste_Copy_PromptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_copy_prompt = /** @type {((inputs?: Paste_Copy_PromptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Copy_PromptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_copy_prompt(inputs)
	return en_paste_copy_prompt(inputs)
});
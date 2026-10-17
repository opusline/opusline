/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Ph_ClientInputs */

const en_paste_prompt_ph_client = /** @type {(inputs: Paste_Prompt_Ph_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exact client name`)
};

const fr_paste_prompt_ph_client = /** @type {(inputs: Paste_Prompt_Ph_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom exact du client`)
};

/**
* | output |
* | --- |
* | "Exact client name" |
*
* @param {Paste_Prompt_Ph_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_ph_client = /** @type {((inputs?: Paste_Prompt_Ph_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Ph_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_ph_client(inputs)
	return en_paste_prompt_ph_client(inputs)
});
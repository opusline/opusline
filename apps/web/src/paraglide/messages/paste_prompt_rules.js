/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_RulesInputs */

const en_paste_prompt_rules = /** @type {(inputs: Paste_Prompt_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rules:`)
};

const fr_paste_prompt_rules = /** @type {(inputs: Paste_Prompt_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Règles :`)
};

/**
* | output |
* | --- |
* | "Rules:" |
*
* @param {Paste_Prompt_RulesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rules = /** @type {((inputs?: Paste_Prompt_RulesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_RulesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rules(inputs)
	return en_paste_prompt_rules(inputs)
});
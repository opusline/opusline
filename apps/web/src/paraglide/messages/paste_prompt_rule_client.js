/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ clients: NonNullable<unknown> }} Paste_Prompt_Rule_ClientInputs */

const en_paste_prompt_rule_client = /** @type {(inputs: Paste_Prompt_Rule_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`<client>: one of these names if it matches: ${i?.clients}. Otherwise, the name as it appears.`)
};

const fr_paste_prompt_rule_client = /** @type {(inputs: Paste_Prompt_Rule_ClientInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`<client> : un de ces noms s'il correspond : ${i?.clients}. Sinon, le nom tel qu'il apparaît.`)
};

/**
* | output |
* | --- |
* | "<client>: one of these names if it matches: {clients}. Otherwise, the name as it appears." |
*
* @param {Paste_Prompt_Rule_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_client = /** @type {((inputs: Paste_Prompt_Rule_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_client(inputs)
	return en_paste_prompt_rule_client(inputs)
});
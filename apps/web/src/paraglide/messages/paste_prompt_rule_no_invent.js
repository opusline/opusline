/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_No_InventInputs */

const en_paste_prompt_rule_no_invent = /** @type {(inputs: Paste_Prompt_Rule_No_InventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Do not invent an amount: if a price is missing, ask me before answering.`)
};

const fr_paste_prompt_rule_no_invent = /** @type {(inputs: Paste_Prompt_Rule_No_InventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`N'invente pas de montant : si un prix manque, demande-le-moi avant de répondre.`)
};

/**
* | output |
* | --- |
* | "Do not invent an amount: if a price is missing, ask me before answering." |
*
* @param {Paste_Prompt_Rule_No_InventInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_no_invent = /** @type {((inputs?: Paste_Prompt_Rule_No_InventInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_No_InventInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_no_invent(inputs)
	return en_paste_prompt_rule_no_invent(inputs)
});
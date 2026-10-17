/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_QuoteInputs */

const en_paste_prompt_rule_quote = /** @type {(inputs: Paste_Prompt_Rule_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<validite_jours>: 15, 30, 60 or 90. <acompte_pourcent>: a number alone, or no tag when there is no deposit.`)
};

const fr_paste_prompt_rule_quote = /** @type {(inputs: Paste_Prompt_Rule_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<validite_jours> : 15, 30, 60 ou 90. <acompte_pourcent> : nombre seul, ou balise absente s'il n'y a pas d'acompte.`)
};

/**
* | output |
* | --- |
* | "<validite_jours>: 15, 30, 60 or 90. <acompte_pourcent>: a number alone, or no tag when there is no deposit." |
*
* @param {Paste_Prompt_Rule_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_quote = /** @type {((inputs?: Paste_Prompt_Rule_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_quote(inputs)
	return en_paste_prompt_rule_quote(inputs)
});
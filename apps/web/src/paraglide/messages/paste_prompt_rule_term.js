/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_TermInputs */

const en_paste_prompt_rule_term = /** @type {(inputs: Paste_Prompt_Rule_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<delai_paiement>: 0 (on receipt), 15, 30, 45, 60, fm (end of month), 30fm or 45fm (days, end of month).`)
};

const fr_paste_prompt_rule_term = /** @type {(inputs: Paste_Prompt_Rule_TermInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<delai_paiement> : 0 (à réception), 15, 30, 45, 60, fm (fin de mois), 30fm ou 45fm (jours fin de mois).`)
};

/**
* | output |
* | --- |
* | "<delai_paiement>: 0 (on receipt), 15, 30, 45, 60, fm (end of month), 30fm or 45fm (days, end of month)." |
*
* @param {Paste_Prompt_Rule_TermInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_term = /** @type {((inputs?: Paste_Prompt_Rule_TermInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_TermInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_term(inputs)
	return en_paste_prompt_rule_term(inputs)
});
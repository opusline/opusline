/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_LineInputs */

const en_paste_prompt_rule_line = /** @type {(inputs: Paste_Prompt_Rule_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One <ligne> tag per service. No line for totals, VAT or the deposit.`)
};

const fr_paste_prompt_rule_line = /** @type {(inputs: Paste_Prompt_Rule_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une balise <ligne> par prestation. Pas de ligne pour les totaux, la TVA ou l'acompte.`)
};

/**
* | output |
* | --- |
* | "One <ligne> tag per service. No line for totals, VAT or the deposit." |
*
* @param {Paste_Prompt_Rule_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_line = /** @type {((inputs?: Paste_Prompt_Rule_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_line(inputs)
	return en_paste_prompt_rule_line(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_VatInputs */

const en_paste_prompt_rule_vat = /** @type {(inputs: Paste_Prompt_Rule_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<tva>: 20, 10, 5.5 or 0.`)
};

const fr_paste_prompt_rule_vat = /** @type {(inputs: Paste_Prompt_Rule_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<tva> : 20, 10, 5.5 ou 0.`)
};

/**
* | output |
* | --- |
* | "<tva>: 20, 10, 5.5 or 0." |
*
* @param {Paste_Prompt_Rule_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_vat = /** @type {((inputs?: Paste_Prompt_Rule_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_vat(inputs)
	return en_paste_prompt_rule_vat(inputs)
});
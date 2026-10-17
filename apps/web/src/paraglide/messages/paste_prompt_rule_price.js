/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ currency: NonNullable<unknown> }} Paste_Prompt_Rule_PriceInputs */

const en_paste_prompt_rule_price = /** @type {(inputs: Paste_Prompt_Rule_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`<prix_unitaire_ht>: a number alone, before tax, in ${i?.currency}, without symbol or space (e.g. 480 or 1250.50).`)
};

const fr_paste_prompt_rule_price = /** @type {(inputs: Paste_Prompt_Rule_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`<prix_unitaire_ht> : nombre seul, hors taxes, en ${i?.currency}, sans symbole ni espace (ex. 480 ou 1250.50).`)
};

/**
* | output |
* | --- |
* | "<prix_unitaire_ht>: a number alone, before tax, in {currency}, without symbol or space (e.g. 480 or 1250.50)." |
*
* @param {Paste_Prompt_Rule_PriceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_price = /** @type {((inputs: Paste_Prompt_Rule_PriceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_PriceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_price(inputs)
	return en_paste_prompt_rule_price(inputs)
});
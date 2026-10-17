/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_UnitInputs */

const en_paste_prompt_rule_unit = /** @type {(inputs: Paste_Prompt_Rule_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<unite>: j (day), h (hour), forfait or u (unit).`)
};

const fr_paste_prompt_rule_unit = /** @type {(inputs: Paste_Prompt_Rule_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<unite> : j (jour), h (heure), forfait ou u (unité).`)
};

/**
* | output |
* | --- |
* | "<unite>: j (day), h (hour), forfait or u (unit)." |
*
* @param {Paste_Prompt_Rule_UnitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_unit = /** @type {((inputs?: Paste_Prompt_Rule_UnitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_UnitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_unit(inputs)
	return en_paste_prompt_rule_unit(inputs)
});
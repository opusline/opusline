/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Rule_Client_AnyInputs */

const en_paste_prompt_rule_client_any = /** @type {(inputs: Paste_Prompt_Rule_Client_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<client>: the client's name as it appears.`)
};

const fr_paste_prompt_rule_client_any = /** @type {(inputs: Paste_Prompt_Rule_Client_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`<client> : le nom du client tel qu'il apparaît.`)
};

/**
* | output |
* | --- |
* | "<client>: the client's name as it appears." |
*
* @param {Paste_Prompt_Rule_Client_AnyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_rule_client_any = /** @type {((inputs?: Paste_Prompt_Rule_Client_AnyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Rule_Client_AnyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_rule_client_any(inputs)
	return en_paste_prompt_rule_client_any(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_Key_HelpInputs */

const en_integrations_anthropic_key_help = /** @type {(inputs: Integrations_Anthropic_Key_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create one in the Anthropic console. It is checked with Anthropic before it is saved, then never shown again.`)
};

const fr_integrations_anthropic_key_help = /** @type {(inputs: Integrations_Anthropic_Key_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez-en une dans la console Anthropic. Elle est vérifiée auprès d'Anthropic avant d'être enregistrée, puis n'est plus jamais affichée.`)
};

/**
* | output |
* | --- |
* | "Create one in the Anthropic console. It is checked with Anthropic before it is saved, then never shown again." |
*
* @param {Integrations_Anthropic_Key_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_key_help = /** @type {((inputs?: Integrations_Anthropic_Key_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_Key_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_key_help(inputs)
	return en_integrations_anthropic_key_help(inputs)
});
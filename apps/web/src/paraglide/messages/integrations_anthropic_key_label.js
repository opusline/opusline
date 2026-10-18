/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_Key_LabelInputs */

const en_integrations_anthropic_key_label = /** @type {(inputs: Integrations_Anthropic_Key_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API key`)
};

const fr_integrations_anthropic_key_label = /** @type {(inputs: Integrations_Anthropic_Key_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clé d'API`)
};

/**
* | output |
* | --- |
* | "API key" |
*
* @param {Integrations_Anthropic_Key_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_key_label = /** @type {((inputs?: Integrations_Anthropic_Key_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_Key_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_key_label(inputs)
	return en_integrations_anthropic_key_label(inputs)
});
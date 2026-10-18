/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_SaveInputs */

const en_integrations_anthropic_save = /** @type {(inputs: Integrations_Anthropic_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the key`)
};

const fr_integrations_anthropic_save = /** @type {(inputs: Integrations_Anthropic_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer la clé`)
};

/**
* | output |
* | --- |
* | "Save the key" |
*
* @param {Integrations_Anthropic_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_save = /** @type {((inputs?: Integrations_Anthropic_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_save(inputs)
	return en_integrations_anthropic_save(inputs)
});
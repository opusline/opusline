/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_RemoveInputs */

const en_integrations_anthropic_remove = /** @type {(inputs: Integrations_Anthropic_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

const fr_integrations_anthropic_remove = /** @type {(inputs: Integrations_Anthropic_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer`)
};

/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Integrations_Anthropic_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_remove = /** @type {((inputs?: Integrations_Anthropic_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_remove(inputs)
	return en_integrations_anthropic_remove(inputs)
});
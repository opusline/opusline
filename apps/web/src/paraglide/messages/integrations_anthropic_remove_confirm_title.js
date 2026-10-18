/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_Remove_Confirm_TitleInputs */

const en_integrations_anthropic_remove_confirm_title = /** @type {(inputs: Integrations_Anthropic_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the Anthropic key?`)
};

const fr_integrations_anthropic_remove_confirm_title = /** @type {(inputs: Integrations_Anthropic_Remove_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer la clé Anthropic ?`)
};

/**
* | output |
* | --- |
* | "Remove the Anthropic key?" |
*
* @param {Integrations_Anthropic_Remove_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_remove_confirm_title = /** @type {((inputs?: Integrations_Anthropic_Remove_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_Remove_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_remove_confirm_title(inputs)
	return en_integrations_anthropic_remove_confirm_title(inputs)
});
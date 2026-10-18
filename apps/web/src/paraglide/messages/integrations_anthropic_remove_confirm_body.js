/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Anthropic_Remove_Confirm_BodyInputs */

const en_integrations_anthropic_remove_confirm_body = /** @type {(inputs: Integrations_Anthropic_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts will be read on your server again: PDFs only, without Claude.`)
};

const fr_integrations_anthropic_remove_confirm_body = /** @type {(inputs: Integrations_Anthropic_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les reçus seront de nouveau lus sur votre serveur : les PDF seulement, sans Claude.`)
};

/**
* | output |
* | --- |
* | "Receipts will be read on your server again: PDFs only, without Claude." |
*
* @param {Integrations_Anthropic_Remove_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_remove_confirm_body = /** @type {((inputs?: Integrations_Anthropic_Remove_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_Remove_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_remove_confirm_body(inputs)
	return en_integrations_anthropic_remove_confirm_body(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ model: NonNullable<unknown> }} Integrations_Anthropic_Saved_DetailInputs */

const en_integrations_anthropic_saved_detail = /** @type {(inputs: Integrations_Anthropic_Saved_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipts are read by ${i?.model}.`)
};

const fr_integrations_anthropic_saved_detail = /** @type {(inputs: Integrations_Anthropic_Saved_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Les reçus sont lus par ${i?.model}.`)
};

/**
* | output |
* | --- |
* | "Receipts are read by {model}." |
*
* @param {Integrations_Anthropic_Saved_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_anthropic_saved_detail = /** @type {((inputs: Integrations_Anthropic_Saved_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Anthropic_Saved_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_anthropic_saved_detail(inputs)
	return en_integrations_anthropic_saved_detail(inputs)
});
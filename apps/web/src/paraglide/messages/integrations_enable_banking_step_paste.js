/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Step_PasteInputs */

const en_integrations_enable_banking_step_paste = /** @type {(inputs: Integrations_Enable_Banking_Step_PasteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste its ID and private key below.`)
};

const fr_integrations_enable_banking_step_paste = /** @type {(inputs: Integrations_Enable_Banking_Step_PasteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collez ci-dessous son identifiant et sa clé privée.`)
};

/**
* | output |
* | --- |
* | "Paste its ID and private key below." |
*
* @param {Integrations_Enable_Banking_Step_PasteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_step_paste = /** @type {((inputs?: Integrations_Enable_Banking_Step_PasteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Step_PasteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_step_paste(inputs)
	return en_integrations_enable_banking_step_paste(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_DocsInputs */

const en_integrations_enable_banking_docs = /** @type {(inputs: Integrations_Enable_Banking_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Setup guide`)
};

const fr_integrations_enable_banking_docs = /** @type {(inputs: Integrations_Enable_Banking_DocsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guide de configuration`)
};

/**
* | output |
* | --- |
* | "Setup guide" |
*
* @param {Integrations_Enable_Banking_DocsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_docs = /** @type {((inputs?: Integrations_Enable_Banking_DocsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_DocsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_docs(inputs)
	return en_integrations_enable_banking_docs(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_DescriptionInputs */

const en_integrations_enable_banking_description = /** @type {(inputs: Integrations_Enable_Banking_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline reads your business account's movements through Enable Banking, using your own Enable Banking application: free as long as it only reads your own accounts.`)
};

const fr_integrations_enable_banking_description = /** @type {(inputs: Integrations_Enable_Banking_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline lit les mouvements de votre compte pro via Enable Banking, avec votre propre application Enable Banking : gratuite tant qu'elle ne lit que vos comptes.`)
};

/**
* | output |
* | --- |
* | "Opusline reads your business account's movements through Enable Banking, using your own Enable Banking application: free as long as it only reads your own ac..." |
*
* @param {Integrations_Enable_Banking_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_description = /** @type {((inputs?: Integrations_Enable_Banking_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_description(inputs)
	return en_integrations_enable_banking_description(inputs)
});
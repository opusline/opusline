/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Private_Key_HelpInputs */

const en_integrations_enable_banking_private_key_help = /** @type {(inputs: Integrations_Enable_Banking_Private_Key_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The contents of the .pem file downloaded when the application was created. It is encrypted and never shown again.`)
};

const fr_integrations_enable_banking_private_key_help = /** @type {(inputs: Integrations_Enable_Banking_Private_Key_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le contenu du fichier .pem téléchargé à la création de l'application. Elle est chiffrée et jamais réaffichée.`)
};

/**
* | output |
* | --- |
* | "The contents of the .pem file downloaded when the application was created. It is encrypted and never shown again." |
*
* @param {Integrations_Enable_Banking_Private_Key_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_private_key_help = /** @type {((inputs?: Integrations_Enable_Banking_Private_Key_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Private_Key_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_private_key_help(inputs)
	return en_integrations_enable_banking_private_key_help(inputs)
});
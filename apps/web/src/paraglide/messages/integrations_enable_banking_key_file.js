/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Key_FileInputs */

const en_integrations_enable_banking_key_file = /** @type {(inputs: Integrations_Enable_Banking_Key_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import the .pem file`)
};

const fr_integrations_enable_banking_key_file = /** @type {(inputs: Integrations_Enable_Banking_Key_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer le fichier .pem`)
};

/**
* | output |
* | --- |
* | "Import the .pem file" |
*
* @param {Integrations_Enable_Banking_Key_FileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_key_file = /** @type {((inputs?: Integrations_Enable_Banking_Key_FileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Key_FileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_key_file(inputs)
	return en_integrations_enable_banking_key_file(inputs)
});
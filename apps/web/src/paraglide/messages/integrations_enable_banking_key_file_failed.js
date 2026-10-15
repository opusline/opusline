/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Key_File_FailedInputs */

const en_integrations_enable_banking_key_file_failed = /** @type {(inputs: Integrations_Enable_Banking_Key_File_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This file could not be read.`)
};

const fr_integrations_enable_banking_key_file_failed = /** @type {(inputs: Integrations_Enable_Banking_Key_File_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce fichier n'a pas pu être lu.`)
};

/**
* | output |
* | --- |
* | "This file could not be read." |
*
* @param {Integrations_Enable_Banking_Key_File_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_key_file_failed = /** @type {((inputs?: Integrations_Enable_Banking_Key_File_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Key_File_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_key_file_failed(inputs)
	return en_integrations_enable_banking_key_file_failed(inputs)
});
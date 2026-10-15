/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Account_Tax_SettingsInputs */

const en_account_tax_settings = /** @type {(inputs: Account_Tax_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tax settings`)
};

const fr_account_tax_settings = /** @type {(inputs: Account_Tax_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages fiscaux`)
};

/**
* | output |
* | --- |
* | "Tax settings" |
*
* @param {Account_Tax_SettingsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const account_tax_settings = /** @type {((inputs?: Account_Tax_SettingsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Account_Tax_SettingsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_account_tax_settings(inputs)
	return en_account_tax_settings(inputs)
});
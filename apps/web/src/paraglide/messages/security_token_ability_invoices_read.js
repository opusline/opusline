/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Ability_Invoices_ReadInputs */

const en_security_token_ability_invoices_read = /** @type {(inputs: Security_Token_Ability_Invoices_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reads invoices`)
};

const fr_security_token_ability_invoices_read = /** @type {(inputs: Security_Token_Ability_Invoices_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lecture des factures`)
};

/**
* | output |
* | --- |
* | "Reads invoices" |
*
* @param {Security_Token_Ability_Invoices_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_ability_invoices_read = /** @type {((inputs?: Security_Token_Ability_Invoices_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Ability_Invoices_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_ability_invoices_read(inputs)
	return en_security_token_ability_invoices_read(inputs)
});
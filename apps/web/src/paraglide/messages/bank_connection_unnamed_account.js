/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Unnamed_AccountInputs */

const en_bank_connection_unnamed_account = /** @type {(inputs: Bank_Connection_Unnamed_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unnamed account`)
};

const fr_bank_connection_unnamed_account = /** @type {(inputs: Bank_Connection_Unnamed_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte sans nom`)
};

/**
* | output |
* | --- |
* | "Unnamed account" |
*
* @param {Bank_Connection_Unnamed_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_unnamed_account = /** @type {((inputs?: Bank_Connection_Unnamed_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Unnamed_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_unnamed_account(inputs)
	return en_bank_connection_unnamed_account(inputs)
});
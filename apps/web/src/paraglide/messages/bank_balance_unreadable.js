/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_UnreadableInputs */

const en_bank_balance_unreadable = /** @type {(inputs: Bank_Balance_UnreadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unreadable amount: use digits, one decimal separator, and an optional leading minus.`)
};

const fr_bank_balance_unreadable = /** @type {(inputs: Bank_Balance_UnreadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant illisible : des chiffres, un séparateur décimal et un signe moins en tête si besoin.`)
};

/**
* | output |
* | --- |
* | "Unreadable amount: use digits, one decimal separator, and an optional leading minus." |
*
* @param {Bank_Balance_UnreadableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_unreadable = /** @type {((inputs?: Bank_Balance_UnreadableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_UnreadableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_unreadable(inputs)
	return en_bank_balance_unreadable(inputs)
});
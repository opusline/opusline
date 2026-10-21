/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Dialog_TitleInputs */

const en_bank_account_dialog_title = /** @type {(inputs: Bank_Account_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank account`)
};

const fr_bank_account_dialog_title = /** @type {(inputs: Bank_Account_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte bancaire`)
};

/**
* | output |
* | --- |
* | "Bank account" |
*
* @param {Bank_Account_Dialog_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_dialog_title = /** @type {((inputs?: Bank_Account_Dialog_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Dialog_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_dialog_title(inputs)
	return en_bank_account_dialog_title(inputs)
});
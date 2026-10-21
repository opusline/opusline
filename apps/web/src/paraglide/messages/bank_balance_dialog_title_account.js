/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Bank_Balance_Dialog_Title_AccountInputs */

const en_bank_balance_dialog_title_account = /** @type {(inputs: Bank_Balance_Dialog_Title_AccountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Balance of ${i?.name}`)
};

const fr_bank_balance_dialog_title_account = /** @type {(inputs: Bank_Balance_Dialog_Title_AccountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Solde de ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Balance of {name}" |
*
* @param {Bank_Balance_Dialog_Title_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_dialog_title_account = /** @type {((inputs: Bank_Balance_Dialog_Title_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Dialog_Title_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_dialog_title_account(inputs)
	return en_bank_balance_dialog_title_account(inputs)
});
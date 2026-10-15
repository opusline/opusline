/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_Dialog_TitleInputs */

const en_bank_balance_dialog_title = /** @type {(inputs: Bank_Balance_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account balance`)
};

const fr_bank_balance_dialog_title = /** @type {(inputs: Bank_Balance_Dialog_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde du compte pro`)
};

/**
* | output |
* | --- |
* | "Business account balance" |
*
* @param {Bank_Balance_Dialog_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_dialog_title = /** @type {((inputs?: Bank_Balance_Dialog_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Dialog_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_dialog_title(inputs)
	return en_bank_balance_dialog_title(inputs)
});
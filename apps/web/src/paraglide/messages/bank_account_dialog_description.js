/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Dialog_DescriptionInputs */

const en_bank_account_dialog_description = /** @type {(inputs: Bank_Account_Dialog_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The name tells your accounts apart on this page. A closed account keeps its history.`)
};

const fr_bank_account_dialog_description = /** @type {(inputs: Bank_Account_Dialog_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le nom distingue vos comptes sur cette page. Un compte clôturé garde son historique.`)
};

/**
* | output |
* | --- |
* | "The name tells your accounts apart on this page. A closed account keeps its history." |
*
* @param {Bank_Account_Dialog_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_dialog_description = /** @type {((inputs?: Bank_Account_Dialog_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Dialog_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_dialog_description(inputs)
	return en_bank_account_dialog_description(inputs)
});
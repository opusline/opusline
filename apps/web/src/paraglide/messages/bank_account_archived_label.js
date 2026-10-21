/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Archived_LabelInputs */

const en_bank_account_archived_label = /** @type {(inputs: Bank_Account_Archived_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account closed`)
};

const fr_bank_account_archived_label = /** @type {(inputs: Bank_Account_Archived_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte clôturé`)
};

/**
* | output |
* | --- |
* | "Account closed" |
*
* @param {Bank_Account_Archived_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_archived_label = /** @type {((inputs?: Bank_Account_Archived_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Archived_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_archived_label(inputs)
	return en_bank_account_archived_label(inputs)
});
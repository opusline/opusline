/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Archived_HintInputs */

const en_bank_account_archived_hint = /** @type {(inputs: Bank_Account_Archived_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Its last balance still counts in the total, but it no longer delays the date the transferable amount relies on.`)
};

const fr_bank_account_archived_hint = /** @type {(inputs: Bank_Account_Archived_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Son dernier solde compte toujours dans le total, mais il ne retarde plus la date sur laquelle s'appuie le montant virable.`)
};

/**
* | output |
* | --- |
* | "Its last balance still counts in the total, but it no longer delays the date the transferable amount relies on." |
*
* @param {Bank_Account_Archived_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_archived_hint = /** @type {((inputs?: Bank_Account_Archived_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Archived_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_archived_hint(inputs)
	return en_bank_account_archived_hint(inputs)
});
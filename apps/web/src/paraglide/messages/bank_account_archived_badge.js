/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Account_Archived_BadgeInputs */

const en_bank_account_archived_badge = /** @type {(inputs: Bank_Account_Archived_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed`)
};

const fr_bank_account_archived_badge = /** @type {(inputs: Bank_Account_Archived_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clôturé`)
};

/**
* | output |
* | --- |
* | "Closed" |
*
* @param {Bank_Account_Archived_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_archived_badge = /** @type {((inputs?: Bank_Account_Archived_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Archived_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_archived_badge(inputs)
	return en_bank_account_archived_badge(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Choose_Account_TitleInputs */



/**
* | output |
* | --- |
* | "Which account should be synced?" |
*
* @param {Bank_Choose_Account_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_choose_account_title = /** @type {((inputs?: Bank_Choose_Account_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Choose_Account_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Quel compte synchroniser ?")
	return /** @type {LocalizedString} */ ("Which account should be synced?")
});
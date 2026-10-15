/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Choose_Account_DescriptionInputs */



/**
* | output |
* | --- |
* | "Your authorization covers several accounts. Opusline syncs one of them: your business account." |
*
* @param {Bank_Choose_Account_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_choose_account_description = /** @type {((inputs?: Bank_Choose_Account_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Choose_Account_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre autorisation couvre plusieurs comptes. Opusline en synchronise un seul : votre compte pro.")
	return /** @type {LocalizedString} */ ("Your authorization covers several accounts. Opusline syncs one of them: your business account.")
});
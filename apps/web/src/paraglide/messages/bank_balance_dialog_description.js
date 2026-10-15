/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_Dialog_DescriptionInputs */



/**
* | output |
* | --- |
* | "The balance you read on your bank today. Statements imported afterwards move it on with their movements." |
*
* @param {Bank_Balance_Dialog_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_dialog_description = /** @type {((inputs?: Bank_Balance_Dialog_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Dialog_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le solde que vous lisez aujourd'hui sur votre banque. Les relevés importés ensuite le font évoluer avec leurs mouvements.")
	return /** @type {LocalizedString} */ ("The balance you read on your bank today. Statements imported afterwards move it on with their movements.")
});
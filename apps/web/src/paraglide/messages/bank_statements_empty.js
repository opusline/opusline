/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Statements_EmptyInputs */



/**
* | output |
* | --- |
* | "No statement imported. The balance shown is the one you entered by hand." |
*
* @param {Bank_Statements_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statements_empty = /** @type {((inputs?: Bank_Statements_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statements_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucun relevé importé. Le solde affiché est celui que vous avez saisi à la main.")
	return /** @type {LocalizedString} */ ("No statement imported. The balance shown is the one you entered by hand.")
});
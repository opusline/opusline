/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_Unlinked_TitleInputs */



/**
* | output |
* | --- |
* | "No suggestions waiting" |
*
* @param {Bank_Reconciled_Unlinked_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_unlinked_title = /** @type {((inputs?: Bank_Reconciled_Unlinked_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_Unlinked_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucune suggestion en attente")
	return /** @type {LocalizedString} */ ("No suggestions waiting")
});
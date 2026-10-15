/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Match_Reason_ReferenceInputs */



/**
* | output |
* | --- |
* | "Exact amount and reference in the label" |
*
* @param {Bank_Match_Reason_ReferenceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_reason_reference = /** @type {((inputs?: Bank_Match_Reason_ReferenceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_Reason_ReferenceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Montant exact et référence dans le libellé")
	return /** @type {LocalizedString} */ ("Exact amount and reference in the label")
});
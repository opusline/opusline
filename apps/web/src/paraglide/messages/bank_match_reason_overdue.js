/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Match_Reason_OverdueInputs */

const en_bank_match_reason_overdue = /** @type {(inputs: Bank_Match_Reason_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exact amount, overdue invoice`)
};

const fr_bank_match_reason_overdue = /** @type {(inputs: Bank_Match_Reason_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant exact, facture en retard`)
};

/**
* | output |
* | --- |
* | "Exact amount, overdue invoice" |
*
* @param {Bank_Match_Reason_OverdueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_reason_overdue = /** @type {((inputs?: Bank_Match_Reason_OverdueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_Reason_OverdueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_match_reason_overdue(inputs)
	return en_bank_match_reason_overdue(inputs)
});
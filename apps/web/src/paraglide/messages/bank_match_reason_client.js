/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Match_Reason_ClientInputs */

const en_bank_match_reason_client = /** @type {(inputs: Bank_Match_Reason_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exact amount, client identified`)
};

const fr_bank_match_reason_client = /** @type {(inputs: Bank_Match_Reason_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant exact, client identifié`)
};

/**
* | output |
* | --- |
* | "Exact amount, client identified" |
*
* @param {Bank_Match_Reason_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_reason_client = /** @type {((inputs?: Bank_Match_Reason_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_Reason_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_match_reason_client(inputs)
	return en_bank_match_reason_client(inputs)
});
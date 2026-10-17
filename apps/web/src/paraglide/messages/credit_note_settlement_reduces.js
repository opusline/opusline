/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Settlement_ReducesInputs */

const en_credit_note_settlement_reduces = /** @type {(inputs: Credit_Note_Settlement_ReducesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deducted from what is due`)
};

const fr_credit_note_settlement_reduces = /** @type {(inputs: Credit_Note_Settlement_ReducesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déduit du solde de la facture`)
};

/**
* | output |
* | --- |
* | "Deducted from what is due" |
*
* @param {Credit_Note_Settlement_ReducesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_settlement_reduces = /** @type {((inputs?: Credit_Note_Settlement_ReducesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Settlement_ReducesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_settlement_reduces(inputs)
	return en_credit_note_settlement_reduces(inputs)
});
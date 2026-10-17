/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Settlement_CancelsInputs */

const en_credit_note_settlement_cancels = /** @type {(inputs: Credit_Note_Settlement_CancelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancels the invoice`)
};

const fr_credit_note_settlement_cancels = /** @type {(inputs: Credit_Note_Settlement_CancelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annule la facture`)
};

/**
* | output |
* | --- |
* | "Cancels the invoice" |
*
* @param {Credit_Note_Settlement_CancelsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_settlement_cancels = /** @type {((inputs?: Credit_Note_Settlement_CancelsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Settlement_CancelsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_settlement_cancels(inputs)
	return en_credit_note_settlement_cancels(inputs)
});
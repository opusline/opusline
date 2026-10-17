/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Settlement_DeductInputs */

const en_credit_note_settlement_deduct = /** @type {(inputs: Credit_Note_Settlement_DeductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deduct from a later invoice`)
};

const fr_credit_note_settlement_deduct = /** @type {(inputs: Credit_Note_Settlement_DeductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déduire d'une prochaine facture`)
};

/**
* | output |
* | --- |
* | "Deduct from a later invoice" |
*
* @param {Credit_Note_Settlement_DeductInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_settlement_deduct = /** @type {((inputs?: Credit_Note_Settlement_DeductInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Settlement_DeductInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_settlement_deduct(inputs)
	return en_credit_note_settlement_deduct(inputs)
});
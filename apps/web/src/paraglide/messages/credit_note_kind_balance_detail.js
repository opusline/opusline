/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_Balance_DetailInputs */

const en_credit_note_kind_balance_detail = /** @type {(inputs: Credit_Note_Kind_Balance_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancels what is left to pay on the invoice.`)
};

const fr_credit_note_kind_balance_detail = /** @type {(inputs: Credit_Note_Kind_Balance_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annule ce qui reste à payer sur la facture.`)
};

/**
* | output |
* | --- |
* | "Cancels what is left to pay on the invoice." |
*
* @param {Credit_Note_Kind_Balance_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_balance_detail = /** @type {((inputs?: Credit_Note_Kind_Balance_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_Balance_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_balance_detail(inputs)
	return en_credit_note_kind_balance_detail(inputs)
});
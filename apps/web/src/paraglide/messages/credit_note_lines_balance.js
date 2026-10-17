/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Lines_BalanceInputs */

const en_credit_note_lines_balance = /** @type {(inputs: Credit_Note_Lines_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One line for what is left to pay, at the invoice's VAT rate.`)
};

const fr_credit_note_lines_balance = /** @type {(inputs: Credit_Note_Lines_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une ligne pour ce qui reste à payer, au taux de TVA de la facture.`)
};

/**
* | output |
* | --- |
* | "One line for what is left to pay, at the invoice's VAT rate." |
*
* @param {Credit_Note_Lines_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_lines_balance = /** @type {((inputs?: Credit_Note_Lines_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Lines_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_lines_balance(inputs)
	return en_credit_note_lines_balance(inputs)
});
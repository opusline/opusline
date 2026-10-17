/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Settlement_RefundInputs */

const en_credit_note_settlement_refund = /** @type {(inputs: Credit_Note_Settlement_RefundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refund the client`)
};

const fr_credit_note_settlement_refund = /** @type {(inputs: Credit_Note_Settlement_RefundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rembourser le client`)
};

/**
* | output |
* | --- |
* | "Refund the client" |
*
* @param {Credit_Note_Settlement_RefundInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_settlement_refund = /** @type {((inputs?: Credit_Note_Settlement_RefundInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Settlement_RefundInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_settlement_refund(inputs)
	return en_credit_note_settlement_refund(inputs)
});
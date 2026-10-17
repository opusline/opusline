/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Notes_Mark_RefundedInputs */

const en_credit_notes_mark_refunded = /** @type {(inputs: Credit_Notes_Mark_RefundedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark the refund as done`)
};

const fr_credit_notes_mark_refunded = /** @type {(inputs: Credit_Notes_Mark_RefundedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer le remboursement effectué`)
};

/**
* | output |
* | --- |
* | "Mark the refund as done" |
*
* @param {Credit_Notes_Mark_RefundedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_mark_refunded = /** @type {((inputs?: Credit_Notes_Mark_RefundedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_Mark_RefundedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_mark_refunded(inputs)
	return en_credit_notes_mark_refunded(inputs)
});
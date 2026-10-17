/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Notes_Refund_FailedInputs */

const en_credit_notes_refund_failed = /** @type {(inputs: Credit_Notes_Refund_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The refund could not be recorded.`)
};

const fr_credit_notes_refund_failed = /** @type {(inputs: Credit_Notes_Refund_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le remboursement n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The refund could not be recorded." |
*
* @param {Credit_Notes_Refund_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_refund_failed = /** @type {((inputs?: Credit_Notes_Refund_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_Refund_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_refund_failed(inputs)
	return en_credit_notes_refund_failed(inputs)
});
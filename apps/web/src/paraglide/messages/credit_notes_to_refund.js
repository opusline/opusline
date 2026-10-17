/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Notes_To_RefundInputs */

const en_credit_notes_to_refund = /** @type {(inputs: Credit_Notes_To_RefundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To refund`)
};

const fr_credit_notes_to_refund = /** @type {(inputs: Credit_Notes_To_RefundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À rembourser`)
};

/**
* | output |
* | --- |
* | "To refund" |
*
* @param {Credit_Notes_To_RefundInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_to_refund = /** @type {((inputs?: Credit_Notes_To_RefundInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_To_RefundInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_to_refund(inputs)
	return en_credit_notes_to_refund(inputs)
});
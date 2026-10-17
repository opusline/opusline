/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Refund_DetailInputs */

const en_credit_note_refund_detail = /** @type {(inputs: Credit_Note_Refund_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You make the transfer, then mark it done on the credit note.`)
};

const fr_credit_note_refund_detail = /** @type {(inputs: Credit_Note_Refund_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous faites le virement, puis vous le marquez effectué sur l'avoir.`)
};

/**
* | output |
* | --- |
* | "You make the transfer, then mark it done on the credit note." |
*
* @param {Credit_Note_Refund_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_refund_detail = /** @type {((inputs?: Credit_Note_Refund_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Refund_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_refund_detail(inputs)
	return en_credit_note_refund_detail(inputs)
});
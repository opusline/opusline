/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Credit_Note_Deduct_DetailInputs */

const en_credit_note_deduct_detail = /** @type {(inputs: Credit_Note_Deduct_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Offered in the next invoice to ${i?.client}, deducted from what it asks.`)
};

const fr_credit_note_deduct_detail = /** @type {(inputs: Credit_Note_Deduct_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Proposé dans la prochaine facture de ${i?.client}, déduit de ce qu'elle demande.`)
};

/**
* | output |
* | --- |
* | "Offered in the next invoice to {client}, deducted from what it asks." |
*
* @param {Credit_Note_Deduct_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_deduct_detail = /** @type {((inputs: Credit_Note_Deduct_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Deduct_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_deduct_detail(inputs)
	return en_credit_note_deduct_detail(inputs)
});
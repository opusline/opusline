/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Credit_Note_RefundInputs */

const en_declarations_credit_note_refund = /** @type {(inputs: Declarations_Credit_Note_RefundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA credit of ${i?.amount}: ask for the refund (box 26) or carry it.`)
};

const fr_declarations_credit_note_refund = /** @type {(inputs: Declarations_Credit_Note_RefundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Crédit de TVA de ${i?.amount} : demandez le remboursement (case 26) ou reportez-le.`)
};

/**
* | output |
* | --- |
* | "TVA credit of {amount}: ask for the refund (box 26) or carry it." |
*
* @param {Declarations_Credit_Note_RefundInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_credit_note_refund = /** @type {((inputs: Declarations_Credit_Note_RefundInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Credit_Note_RefundInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_credit_note_refund(inputs)
	return en_declarations_credit_note_refund(inputs)
});
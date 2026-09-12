/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Credit_Note_CarryInputs */

const en_declarations_credit_note_carry = /** @type {(inputs: Declarations_Credit_Note_CarryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA credit of ${i?.amount}: it will lower next month's TVA to pay.`)
};

const fr_declarations_credit_note_carry = /** @type {(inputs: Declarations_Credit_Note_CarryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Crédit de TVA de ${i?.amount} : il réduira la TVA à payer du mois prochain.`)
};

/**
* | output |
* | --- |
* | "TVA credit of {amount}: it will lower next month's TVA to pay." |
*
* @param {Declarations_Credit_Note_CarryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_credit_note_carry = /** @type {((inputs: Declarations_Credit_Note_CarryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Credit_Note_CarryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_credit_note_carry(inputs)
	return en_declarations_credit_note_carry(inputs)
});
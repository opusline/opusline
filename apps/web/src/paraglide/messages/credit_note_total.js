/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Credit_Note_TotalInputs */

const en_credit_note_total = /** @type {(inputs: Credit_Note_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Credit note TTC ${i?.amount}`)
};

const fr_credit_note_total = /** @type {(inputs: Credit_Note_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Avoir TTC ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Credit note TTC {amount}" |
*
* @param {Credit_Note_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_total = /** @type {((inputs: Credit_Note_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_total(inputs)
	return en_credit_note_total(inputs)
});
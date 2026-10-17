/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Credit_Note_IssuedInputs */

const en_credit_note_issued = /** @type {(inputs: Credit_Note_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Credit note ${i?.number} issued`)
};

const fr_credit_note_issued = /** @type {(inputs: Credit_Note_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Avoir ${i?.number} émis`)
};

/**
* | output |
* | --- |
* | "Credit note {number} issued" |
*
* @param {Credit_Note_IssuedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_issued = /** @type {((inputs: Credit_Note_IssuedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_IssuedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_issued(inputs)
	return en_credit_note_issued(inputs)
});
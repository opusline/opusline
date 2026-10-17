/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Credit_Notes_Issued_OnInputs */

const en_credit_notes_issued_on = /** @type {(inputs: Credit_Notes_Issued_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Issued on ${i?.date}`)
};

const fr_credit_notes_issued_on = /** @type {(inputs: Credit_Notes_Issued_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Émis le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Issued on {date}" |
*
* @param {Credit_Notes_Issued_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_issued_on = /** @type {((inputs: Credit_Notes_Issued_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_Issued_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_issued_on(inputs)
	return en_credit_notes_issued_on(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Credit_Note_HeadingInputs */

const en_credit_note_heading = /** @type {(inputs: Credit_Note_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Credit note on invoice ${i?.number}`)
};

const fr_credit_note_heading = /** @type {(inputs: Credit_Note_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Avoir sur la facture ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Credit note on invoice {number}" |
*
* @param {Credit_Note_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_heading = /** @type {((inputs: Credit_Note_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_heading(inputs)
	return en_credit_note_heading(inputs)
});
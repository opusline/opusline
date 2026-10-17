/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_FullInputs */

const en_credit_note_kind_full = /** @type {(inputs: Credit_Note_Kind_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Full credit note`)
};

const fr_credit_note_kind_full = /** @type {(inputs: Credit_Note_Kind_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir total`)
};

/**
* | output |
* | --- |
* | "Full credit note" |
*
* @param {Credit_Note_Kind_FullInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_full = /** @type {((inputs?: Credit_Note_Kind_FullInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_FullInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_full(inputs)
	return en_credit_note_kind_full(inputs)
});
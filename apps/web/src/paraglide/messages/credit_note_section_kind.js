/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Section_KindInputs */

const en_credit_note_section_kind = /** @type {(inputs: Credit_Note_Section_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kind of credit note`)
};

const fr_credit_note_section_kind = /** @type {(inputs: Credit_Note_Section_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type d'avoir`)
};

/**
* | output |
* | --- |
* | "Kind of credit note" |
*
* @param {Credit_Note_Section_KindInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_section_kind = /** @type {((inputs?: Credit_Note_Section_KindInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Section_KindInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_section_kind(inputs)
	return en_credit_note_section_kind(inputs)
});
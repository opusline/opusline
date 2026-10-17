/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Section_LinesInputs */

const en_credit_note_section_lines = /** @type {(inputs: Credit_Note_Section_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines`)
};

const fr_credit_note_section_lines = /** @type {(inputs: Credit_Note_Section_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lignes`)
};

/**
* | output |
* | --- |
* | "Lines" |
*
* @param {Credit_Note_Section_LinesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_section_lines = /** @type {((inputs?: Credit_Note_Section_LinesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Section_LinesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_section_lines(inputs)
	return en_credit_note_section_lines(inputs)
});
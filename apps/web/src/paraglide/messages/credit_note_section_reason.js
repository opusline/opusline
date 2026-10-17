/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Section_ReasonInputs */

const en_credit_note_section_reason = /** @type {(inputs: Credit_Note_Section_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reason`)
};

const fr_credit_note_section_reason = /** @type {(inputs: Credit_Note_Section_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motif`)
};

/**
* | output |
* | --- |
* | "Reason" |
*
* @param {Credit_Note_Section_ReasonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_section_reason = /** @type {((inputs?: Credit_Note_Section_ReasonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Section_ReasonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_section_reason(inputs)
	return en_credit_note_section_reason(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_Credit_NoteInputs */

const en_emails_kind_credit_note = /** @type {(inputs: Emails_Kind_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Credit note`)
};

const fr_emails_kind_credit_note = /** @type {(inputs: Emails_Kind_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir`)
};

/**
* | output |
* | --- |
* | "Credit note" |
*
* @param {Emails_Kind_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_credit_note = /** @type {((inputs?: Emails_Kind_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_credit_note(inputs)
	return en_emails_kind_credit_note(inputs)
});
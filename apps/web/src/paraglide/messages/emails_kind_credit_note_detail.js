/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_Credit_Note_DetailInputs */

const en_emails_kind_credit_note_detail = /** @type {(inputs: Emails_Kind_Credit_Note_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent with every credit note issued`)
};

const fr_emails_kind_credit_note_detail = /** @type {(inputs: Emails_Kind_Credit_Note_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé avec chaque avoir émis`)
};

/**
* | output |
* | --- |
* | "Sent with every credit note issued" |
*
* @param {Emails_Kind_Credit_Note_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_credit_note_detail = /** @type {((inputs?: Emails_Kind_Credit_Note_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_Credit_Note_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_credit_note_detail(inputs)
	return en_emails_kind_credit_note_detail(inputs)
});
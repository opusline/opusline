/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Issue_FailedInputs */

const en_credit_note_issue_failed = /** @type {(inputs: Credit_Note_Issue_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The credit note could not be issued.`)
};

const fr_credit_note_issue_failed = /** @type {(inputs: Credit_Note_Issue_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'avoir n'a pas pu être émis.`)
};

/**
* | output |
* | --- |
* | "The credit note could not be issued." |
*
* @param {Credit_Note_Issue_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_issue_failed = /** @type {((inputs?: Credit_Note_Issue_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Issue_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_issue_failed(inputs)
	return en_credit_note_issue_failed(inputs)
});
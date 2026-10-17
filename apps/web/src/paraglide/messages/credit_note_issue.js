/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_IssueInputs */

const en_credit_note_issue = /** @type {(inputs: Credit_Note_IssueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issue the credit note`)
};

const fr_credit_note_issue = /** @type {(inputs: Credit_Note_IssueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Émettre l'avoir`)
};

/**
* | output |
* | --- |
* | "Issue the credit note" |
*
* @param {Credit_Note_IssueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_issue = /** @type {((inputs?: Credit_Note_IssueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_IssueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_issue(inputs)
	return en_credit_note_issue(inputs)
});
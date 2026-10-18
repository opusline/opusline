/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_FailedInputs */

const en_report_chat_failed = /** @type {(inputs: Report_Chat_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude could not answer. Try again, or fill in the form yourself.`)
};

const fr_report_chat_failed = /** @type {(inputs: Report_Chat_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude n'a pas pu répondre. Réessayez, ou remplissez le formulaire vous-même.`)
};

/**
* | output |
* | --- |
* | "Claude could not answer. Try again, or fill in the form yourself." |
*
* @param {Report_Chat_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_failed = /** @type {((inputs?: Report_Chat_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_failed(inputs)
	return en_report_chat_failed(inputs)
});
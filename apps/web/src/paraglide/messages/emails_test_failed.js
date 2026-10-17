/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Test_FailedInputs */

const en_emails_test_failed = /** @type {(inputs: Emails_Test_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The test e-mail could not be sent.`)
};

const fr_emails_test_failed = /** @type {(inputs: Emails_Test_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'e-mail de test n'a pas pu être envoyé.`)
};

/**
* | output |
* | --- |
* | "The test e-mail could not be sent." |
*
* @param {Emails_Test_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_test_failed = /** @type {((inputs?: Emails_Test_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Test_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_test_failed(inputs)
	return en_emails_test_failed(inputs)
});
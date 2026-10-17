/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Test_SentInputs */

const en_emails_test_sent = /** @type {(inputs: Emails_Test_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Test e-mail sent to your address`)
};

const fr_emails_test_sent = /** @type {(inputs: Emails_Test_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-mail de test envoyé à votre adresse`)
};

/**
* | output |
* | --- |
* | "Test e-mail sent to your address" |
*
* @param {Emails_Test_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_test_sent = /** @type {((inputs?: Emails_Test_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Test_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_test_sent(inputs)
	return en_emails_test_sent(inputs)
});
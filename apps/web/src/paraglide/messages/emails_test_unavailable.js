/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Test_UnavailableInputs */

const en_emails_test_unavailable = /** @type {(inputs: Emails_Test_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance sends no e-mail: set MAIL_* to try the templates for real.`)
};

const fr_emails_test_unavailable = /** @type {(inputs: Emails_Test_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance n'envoie pas d'e-mail : renseignez MAIL_* pour essayer les modèles pour de vrai.`)
};

/**
* | output |
* | --- |
* | "This instance sends no e-mail: set MAIL_* to try the templates for real." |
*
* @param {Emails_Test_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_test_unavailable = /** @type {((inputs?: Emails_Test_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Test_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_test_unavailable(inputs)
	return en_emails_test_unavailable(inputs)
});
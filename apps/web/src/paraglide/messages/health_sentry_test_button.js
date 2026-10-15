/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Health_Sentry_Test_ButtonInputs */



/**
* | output |
* | --- |
* | "Send a test error to Sentry" |
*
* @param {Health_Sentry_Test_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const health_sentry_test_button = /** @type {((inputs?: Health_Sentry_Test_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Health_Sentry_Test_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Envoyer une erreur de test à Sentry")
	return /** @type {LocalizedString} */ ("Send a test error to Sentry")
});
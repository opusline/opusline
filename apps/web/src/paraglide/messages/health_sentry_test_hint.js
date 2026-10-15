/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Health_Sentry_Test_HintInputs */

const en_health_sentry_test_hint = /** @type {(inputs: Health_Sentry_Test_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance reports browser errors to Sentry. Send a deliberate error to check that it arrives.`)
};

const fr_health_sentry_test_hint = /** @type {(inputs: Health_Sentry_Test_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance signale les erreurs du navigateur à Sentry. Envoyez une erreur volontaire pour vérifier qu'elle arrive bien.`)
};

/**
* | output |
* | --- |
* | "This instance reports browser errors to Sentry. Send a deliberate error to check that it arrives." |
*
* @param {Health_Sentry_Test_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const health_sentry_test_hint = /** @type {((inputs?: Health_Sentry_Test_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Health_Sentry_Test_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_health_sentry_test_hint(inputs)
	return en_health_sentry_test_hint(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_FailedInputs */

const en_auth_two_factor_failed = /** @type {(inputs: Auth_Two_Factor_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The verification failed. Try again in a moment.`)
};

const fr_auth_two_factor_failed = /** @type {(inputs: Auth_Two_Factor_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La vérification a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The verification failed. Try again in a moment." |
*
* @param {Auth_Two_Factor_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_failed = /** @type {((inputs?: Auth_Two_Factor_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_failed(inputs)
	return en_auth_two_factor_failed(inputs)
});
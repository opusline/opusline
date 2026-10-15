/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_FailedInputs */

const en_auth_forgot_failed = /** @type {(inputs: Auth_Forgot_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The link could not be requested. Try again in a moment.`)
};

const fr_auth_forgot_failed = /** @type {(inputs: Auth_Forgot_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La demande n'a pas pu être envoyée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The link could not be requested. Try again in a moment." |
*
* @param {Auth_Forgot_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_failed = /** @type {((inputs?: Auth_Forgot_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_failed(inputs)
	return en_auth_forgot_failed(inputs)
});
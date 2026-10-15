/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_FailedInputs */

const en_auth_reset_failed = /** @type {(inputs: Auth_Reset_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The password could not be changed. Try again in a moment.`)
};

const fr_auth_reset_failed = /** @type {(inputs: Auth_Reset_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le mot de passe n'a pas pu être modifié. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The password could not be changed. Try again in a moment." |
*
* @param {Auth_Reset_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_failed = /** @type {((inputs?: Auth_Reset_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_failed(inputs)
	return en_auth_reset_failed(inputs)
});
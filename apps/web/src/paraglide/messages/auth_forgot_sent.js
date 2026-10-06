/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_SentInputs */

const en_auth_forgot_sent = /** @type {(inputs: Auth_Forgot_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`If an account uses this address, a link to choose a new password is on its way.`)
};

const fr_auth_forgot_sent = /** @type {(inputs: Auth_Forgot_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Si un compte utilise cette adresse, un lien pour choisir un nouveau mot de passe est en route.`)
};

/**
* | output |
* | --- |
* | "If an account uses this address, a link to choose a new password is on its way." |
*
* @param {Auth_Forgot_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_sent = /** @type {((inputs?: Auth_Forgot_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_sent(inputs)
	return en_auth_forgot_sent(inputs)
});
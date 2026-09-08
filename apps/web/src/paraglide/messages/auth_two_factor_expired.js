/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_ExpiredInputs */

const en_auth_two_factor_expired = /** @type {(inputs: Auth_Two_Factor_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This sign-in attempt has expired. Enter your password again.`)
};

const fr_auth_two_factor_expired = /** @type {(inputs: Auth_Two_Factor_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette tentative de connexion a expiré. Saisissez à nouveau votre mot de passe.`)
};

/**
* | output |
* | --- |
* | "This sign-in attempt has expired. Enter your password again." |
*
* @param {Auth_Two_Factor_ExpiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_expired = /** @type {((inputs?: Auth_Two_Factor_ExpiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_ExpiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_expired(inputs)
	return en_auth_two_factor_expired(inputs)
});
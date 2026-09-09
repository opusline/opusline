/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Method_TotpInputs */

const en_auth_method_totp = /** @type {(inputs: Auth_Method_TotpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Authenticator app`)
};

const fr_auth_method_totp = /** @type {(inputs: Auth_Method_TotpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application d'authentification`)
};

/**
* | output |
* | --- |
* | "Authenticator app" |
*
* @param {Auth_Method_TotpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_method_totp = /** @type {((inputs?: Auth_Method_TotpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Method_TotpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_method_totp(inputs)
	return en_auth_method_totp(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_TitleInputs */

const en_security_totp_title = /** @type {(inputs: Security_Totp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Authenticator app`)
};

const fr_security_totp_title = /** @type {(inputs: Security_Totp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Application d'authentification`)
};

/**
* | output |
* | --- |
* | "Authenticator app" |
*
* @param {Security_Totp_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_title = /** @type {((inputs?: Security_Totp_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_title(inputs)
	return en_security_totp_title(inputs)
});
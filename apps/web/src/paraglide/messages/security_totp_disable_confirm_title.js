/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Disable_Confirm_TitleInputs */

const en_security_totp_disable_confirm_title = /** @type {(inputs: Security_Totp_Disable_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn off the authenticator app?`)
};

const fr_security_totp_disable_confirm_title = /** @type {(inputs: Security_Totp_Disable_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactiver l'application d'authentification ?`)
};

/**
* | output |
* | --- |
* | "Turn off the authenticator app?" |
*
* @param {Security_Totp_Disable_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_disable_confirm_title = /** @type {((inputs?: Security_Totp_Disable_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Disable_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_disable_confirm_title(inputs)
	return en_security_totp_disable_confirm_title(inputs)
});
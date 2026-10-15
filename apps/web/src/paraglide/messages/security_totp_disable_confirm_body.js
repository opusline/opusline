/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Disable_Confirm_BodyInputs */

const en_security_totp_disable_confirm_body = /** @type {(inputs: Security_Totp_Disable_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your password alone will sign you in again. The recovery codes and the trusted browsers are forgotten.`)
};

const fr_security_totp_disable_confirm_body = /** @type {(inputs: Security_Totp_Disable_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre mot de passe seul suffira de nouveau. Les codes de secours et les navigateurs de confiance seront oubliés.`)
};

/**
* | output |
* | --- |
* | "Your password alone will sign you in again. The recovery codes and the trusted browsers are forgotten." |
*
* @param {Security_Totp_Disable_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_disable_confirm_body = /** @type {((inputs?: Security_Totp_Disable_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Disable_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_disable_confirm_body(inputs)
	return en_security_totp_disable_confirm_body(inputs)
});
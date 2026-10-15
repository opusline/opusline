/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Off_HintInputs */

const en_security_totp_off_hint = /** @type {(inputs: Security_Totp_Off_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your password alone signs you in.`)
};

const fr_security_totp_off_hint = /** @type {(inputs: Security_Totp_Off_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre mot de passe seul suffit pour vous connecter.`)
};

/**
* | output |
* | --- |
* | "Your password alone signs you in." |
*
* @param {Security_Totp_Off_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_off_hint = /** @type {((inputs?: Security_Totp_Off_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Off_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_off_hint(inputs)
	return en_security_totp_off_hint(inputs)
});
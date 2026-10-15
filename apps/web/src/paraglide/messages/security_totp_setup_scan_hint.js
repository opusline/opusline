/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_Scan_HintInputs */

const en_security_totp_setup_scan_hint = /** @type {(inputs: Security_Totp_Setup_Scan_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scan this code with your authenticator app, then enter the six digits it shows.`)
};

const fr_security_totp_setup_scan_hint = /** @type {(inputs: Security_Totp_Setup_Scan_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scannez ce code avec votre application d'authentification, puis saisissez les six chiffres qu'elle affiche.`)
};

/**
* | output |
* | --- |
* | "Scan this code with your authenticator app, then enter the six digits it shows." |
*
* @param {Security_Totp_Setup_Scan_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_scan_hint = /** @type {((inputs?: Security_Totp_Setup_Scan_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_Scan_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_setup_scan_hint(inputs)
	return en_security_totp_setup_scan_hint(inputs)
});
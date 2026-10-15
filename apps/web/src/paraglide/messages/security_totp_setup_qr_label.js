/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_Qr_LabelInputs */



/**
* | output |
* | --- |
* | "QR code to scan with an authenticator app" |
*
* @param {Security_Totp_Setup_Qr_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_qr_label = /** @type {((inputs?: Security_Totp_Setup_Qr_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_Qr_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("QR code à scanner avec une application d'authentification")
	return /** @type {LocalizedString} */ ("QR code to scan with an authenticator app")
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Status_OffInputs */

const en_security_totp_status_off = /** @type {(inputs: Security_Totp_Status_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Off`)
};

const fr_security_totp_status_off = /** @type {(inputs: Security_Totp_Status_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactivée`)
};

/**
* | output |
* | --- |
* | "Off" |
*
* @param {Security_Totp_Status_OffInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_status_off = /** @type {((inputs?: Security_Totp_Status_OffInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Status_OffInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_status_off(inputs)
	return en_security_totp_status_off(inputs)
});
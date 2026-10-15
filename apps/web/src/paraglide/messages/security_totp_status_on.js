/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Status_OnInputs */

const en_security_totp_status_on = /** @type {(inputs: Security_Totp_Status_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On`)
};

const fr_security_totp_status_on = /** @type {(inputs: Security_Totp_Status_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activée`)
};

/**
* | output |
* | --- |
* | "On" |
*
* @param {Security_Totp_Status_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_status_on = /** @type {((inputs?: Security_Totp_Status_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Status_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_status_on(inputs)
	return en_security_totp_status_on(inputs)
});
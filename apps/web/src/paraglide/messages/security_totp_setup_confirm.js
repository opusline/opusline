/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_ConfirmInputs */

const en_security_totp_setup_confirm = /** @type {(inputs: Security_Totp_Setup_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm`)
};

const fr_security_totp_setup_confirm = /** @type {(inputs: Security_Totp_Setup_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer`)
};

/**
* | output |
* | --- |
* | "Confirm" |
*
* @param {Security_Totp_Setup_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_confirm = /** @type {((inputs?: Security_Totp_Setup_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_setup_confirm(inputs)
	return en_security_totp_setup_confirm(inputs)
});
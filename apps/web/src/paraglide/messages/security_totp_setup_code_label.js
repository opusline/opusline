/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_Code_LabelInputs */

const en_security_totp_setup_code_label = /** @type {(inputs: Security_Totp_Setup_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Six-digit code`)
};

const fr_security_totp_setup_code_label = /** @type {(inputs: Security_Totp_Setup_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code à six chiffres`)
};

/**
* | output |
* | --- |
* | "Six-digit code" |
*
* @param {Security_Totp_Setup_Code_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_code_label = /** @type {((inputs?: Security_Totp_Setup_Code_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_Code_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_setup_code_label(inputs)
	return en_security_totp_setup_code_label(inputs)
});
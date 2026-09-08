/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_Secret_LabelInputs */

const en_security_totp_setup_secret_label = /** @type {(inputs: Security_Totp_Setup_Secret_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Secret key`)
};

const fr_security_totp_setup_secret_label = /** @type {(inputs: Security_Totp_Setup_Secret_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clé secrète`)
};

/**
* | output |
* | --- |
* | "Secret key" |
*
* @param {Security_Totp_Setup_Secret_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_secret_label = /** @type {((inputs?: Security_Totp_Setup_Secret_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_Secret_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_setup_secret_label(inputs)
	return en_security_totp_setup_secret_label(inputs)
});
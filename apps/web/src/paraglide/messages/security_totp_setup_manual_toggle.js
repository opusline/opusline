/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_Setup_Manual_ToggleInputs */

const en_security_totp_setup_manual_toggle = /** @type {(inputs: Security_Totp_Setup_Manual_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Can't scan? Enter the key by hand`)
};

const fr_security_totp_setup_manual_toggle = /** @type {(inputs: Security_Totp_Setup_Manual_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de scanner ? Saisissez la clé à la main`)
};

/**
* | output |
* | --- |
* | "Can't scan? Enter the key by hand" |
*
* @param {Security_Totp_Setup_Manual_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_setup_manual_toggle = /** @type {((inputs?: Security_Totp_Setup_Manual_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_Setup_Manual_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_setup_manual_toggle(inputs)
	return en_security_totp_setup_manual_toggle(inputs)
});
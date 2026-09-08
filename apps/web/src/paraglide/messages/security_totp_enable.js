/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_EnableInputs */

const en_security_totp_enable = /** @type {(inputs: Security_Totp_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn on`)
};

const fr_security_totp_enable = /** @type {(inputs: Security_Totp_EnableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer`)
};

/**
* | output |
* | --- |
* | "Turn on" |
*
* @param {Security_Totp_EnableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_enable = /** @type {((inputs?: Security_Totp_EnableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_EnableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_enable(inputs)
	return en_security_totp_enable(inputs)
});
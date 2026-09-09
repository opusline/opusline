/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Totp_DisableInputs */

const en_security_totp_disable = /** @type {(inputs: Security_Totp_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn off`)
};

const fr_security_totp_disable = /** @type {(inputs: Security_Totp_DisableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactiver`)
};

/**
* | output |
* | --- |
* | "Turn off" |
*
* @param {Security_Totp_DisableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_totp_disable = /** @type {((inputs?: Security_Totp_DisableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Totp_DisableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_totp_disable(inputs)
	return en_security_totp_disable(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Default_NameInputs */

const en_security_passkey_default_name = /** @type {(inputs: Security_Passkey_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My passkey`)
};

const fr_security_passkey_default_name = /** @type {(inputs: Security_Passkey_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ma clé d'accès`)
};

/**
* | output |
* | --- |
* | "My passkey" |
*
* @param {Security_Passkey_Default_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_default_name = /** @type {((inputs?: Security_Passkey_Default_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Default_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_default_name(inputs)
	return en_security_passkey_default_name(inputs)
});
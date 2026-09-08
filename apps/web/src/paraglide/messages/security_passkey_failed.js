/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_FailedInputs */

const en_security_passkey_failed = /** @type {(inputs: Security_Passkey_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The passkey could not be created. Try again.`)
};

const fr_security_passkey_failed = /** @type {(inputs: Security_Passkey_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La clé d'accès n'a pas pu être créée. Réessayez.`)
};

/**
* | output |
* | --- |
* | "The passkey could not be created. Try again." |
*
* @param {Security_Passkey_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_failed = /** @type {((inputs?: Security_Passkey_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_failed(inputs)
	return en_security_passkey_failed(inputs)
});
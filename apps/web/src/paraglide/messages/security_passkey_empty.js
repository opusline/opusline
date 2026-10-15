/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_EmptyInputs */

const en_security_passkey_empty = /** @type {(inputs: Security_Passkey_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No passkey yet.`)
};

const fr_security_passkey_empty = /** @type {(inputs: Security_Passkey_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune clé d'accès pour le moment.`)
};

/**
* | output |
* | --- |
* | "No passkey yet." |
*
* @param {Security_Passkey_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_empty = /** @type {((inputs?: Security_Passkey_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_empty(inputs)
	return en_security_passkey_empty(inputs)
});
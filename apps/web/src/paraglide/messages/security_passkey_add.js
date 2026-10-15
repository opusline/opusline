/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_AddInputs */

const en_security_passkey_add = /** @type {(inputs: Security_Passkey_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a passkey`)
};

const fr_security_passkey_add = /** @type {(inputs: Security_Passkey_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une clé d'accès`)
};

/**
* | output |
* | --- |
* | "Add a passkey" |
*
* @param {Security_Passkey_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_add = /** @type {((inputs?: Security_Passkey_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_add(inputs)
	return en_security_passkey_add(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_DescriptionInputs */

const en_security_passkey_description = /** @type {(inputs: Security_Passkey_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in with Touch ID, Windows Hello, a security key or your password manager: no password, no code. A passkey also answers the two-step verification.`)
};

const fr_security_passkey_description = /** @type {(inputs: Security_Passkey_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connectez-vous avec Touch ID, Windows Hello, une clé de sécurité ou votre gestionnaire de mots de passe : ni mot de passe, ni code. Une clé d'accès répond aussi à la vérification en deux étapes.`)
};

/**
* | output |
* | --- |
* | "Sign in with Touch ID, Windows Hello, a security key or your password manager: no password, no code. A passkey also answers the two-step verification." |
*
* @param {Security_Passkey_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_description = /** @type {((inputs?: Security_Passkey_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_description(inputs)
	return en_security_passkey_description(inputs)
});
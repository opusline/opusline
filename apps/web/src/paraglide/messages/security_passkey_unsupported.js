/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_UnsupportedInputs */



/**
* | output |
* | --- |
* | "This browser does not support passkeys." |
*
* @param {Security_Passkey_UnsupportedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_unsupported = /** @type {((inputs?: Security_Passkey_UnsupportedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_UnsupportedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ce navigateur ne prend pas en charge les clés d'accès.")
	return /** @type {LocalizedString} */ ("This browser does not support passkeys.")
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_DuplicateInputs */



/**
* | output |
* | --- |
* | "This passkey is already registered." |
*
* @param {Security_Passkey_DuplicateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_duplicate = /** @type {((inputs?: Security_Passkey_DuplicateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_DuplicateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Cette clé d'accès est déjà enregistrée.")
	return /** @type {LocalizedString} */ ("This passkey is already registered.")
});
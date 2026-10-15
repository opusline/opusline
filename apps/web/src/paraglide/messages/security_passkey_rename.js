/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_RenameInputs */

const en_security_passkey_rename = /** @type {(inputs: Security_Passkey_RenameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rename`)
};

const fr_security_passkey_rename = /** @type {(inputs: Security_Passkey_RenameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renommer`)
};

/**
* | output |
* | --- |
* | "Rename" |
*
* @param {Security_Passkey_RenameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_rename = /** @type {((inputs?: Security_Passkey_RenameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_RenameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_rename(inputs)
	return en_security_passkey_rename(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Rename_TitleInputs */

const en_security_passkey_rename_title = /** @type {(inputs: Security_Passkey_Rename_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rename the passkey`)
};

const fr_security_passkey_rename_title = /** @type {(inputs: Security_Passkey_Rename_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renommer la clé d'accès`)
};

/**
* | output |
* | --- |
* | "Rename the passkey" |
*
* @param {Security_Passkey_Rename_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_rename_title = /** @type {((inputs?: Security_Passkey_Rename_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Rename_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_rename_title(inputs)
	return en_security_passkey_rename_title(inputs)
});
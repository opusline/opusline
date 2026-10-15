/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Name_TitleInputs */

const en_security_passkey_name_title = /** @type {(inputs: Security_Passkey_Name_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name this passkey`)
};

const fr_security_passkey_name_title = /** @type {(inputs: Security_Passkey_Name_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nommer cette clé d'accès`)
};

/**
* | output |
* | --- |
* | "Name this passkey" |
*
* @param {Security_Passkey_Name_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_name_title = /** @type {((inputs?: Security_Passkey_Name_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Name_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_name_title(inputs)
	return en_security_passkey_name_title(inputs)
});
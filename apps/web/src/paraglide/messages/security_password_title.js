/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Password_TitleInputs */

const en_security_password_title = /** @type {(inputs: Security_Password_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password`)
};

const fr_security_password_title = /** @type {(inputs: Security_Password_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe`)
};

/**
* | output |
* | --- |
* | "Password" |
*
* @param {Security_Password_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_password_title = /** @type {((inputs?: Security_Password_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Password_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_password_title(inputs)
	return en_security_password_title(inputs)
});
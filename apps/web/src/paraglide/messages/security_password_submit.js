/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Password_SubmitInputs */

const en_security_password_submit = /** @type {(inputs: Security_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change password`)
};

const fr_security_password_submit = /** @type {(inputs: Security_Password_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer le mot de passe`)
};

/**
* | output |
* | --- |
* | "Change password" |
*
* @param {Security_Password_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_password_submit = /** @type {((inputs?: Security_Password_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Password_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_password_submit(inputs)
	return en_security_password_submit(inputs)
});
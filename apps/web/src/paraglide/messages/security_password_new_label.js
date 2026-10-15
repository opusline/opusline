/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Password_New_LabelInputs */

const en_security_password_new_label = /** @type {(inputs: Security_Password_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New password`)
};

const fr_security_password_new_label = /** @type {(inputs: Security_Password_New_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau mot de passe`)
};

/**
* | output |
* | --- |
* | "New password" |
*
* @param {Security_Password_New_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_password_new_label = /** @type {((inputs?: Security_Password_New_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Password_New_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_password_new_label(inputs)
	return en_security_password_new_label(inputs)
});
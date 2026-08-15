/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Confirm_LabelInputs */

const en_auth_password_confirm_label = /** @type {(inputs: Auth_Password_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm password`)
};

const fr_auth_password_confirm_label = /** @type {(inputs: Auth_Password_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer le mot de passe`)
};

/**
* | output |
* | --- |
* | "Confirm password" |
*
* @param {Auth_Password_Confirm_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_password_confirm_label = /** @type {((inputs?: Auth_Password_Confirm_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Confirm_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_password_confirm_label(inputs)
	return en_auth_password_confirm_label(inputs)
});
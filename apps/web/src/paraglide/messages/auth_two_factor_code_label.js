/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Code_LabelInputs */

const en_auth_two_factor_code_label = /** @type {(inputs: Auth_Two_Factor_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code from your authenticator app`)
};

const fr_auth_two_factor_code_label = /** @type {(inputs: Auth_Two_Factor_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code de votre application d'authentification`)
};

/**
* | output |
* | --- |
* | "Code from your authenticator app" |
*
* @param {Auth_Two_Factor_Code_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_code_label = /** @type {((inputs?: Auth_Two_Factor_Code_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Code_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_code_label(inputs)
	return en_auth_two_factor_code_label(inputs)
});
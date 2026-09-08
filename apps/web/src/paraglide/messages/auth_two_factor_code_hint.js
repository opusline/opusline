/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Code_HintInputs */

const en_auth_two_factor_code_hint = /** @type {(inputs: Auth_Two_Factor_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the six-digit code shown by your app.`)
};

const fr_auth_two_factor_code_hint = /** @type {(inputs: Auth_Two_Factor_Code_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez le code à six chiffres affiché par votre application.`)
};

/**
* | output |
* | --- |
* | "Enter the six-digit code shown by your app." |
*
* @param {Auth_Two_Factor_Code_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_code_hint = /** @type {((inputs?: Auth_Two_Factor_Code_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Code_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_code_hint(inputs)
	return en_auth_two_factor_code_hint(inputs)
});
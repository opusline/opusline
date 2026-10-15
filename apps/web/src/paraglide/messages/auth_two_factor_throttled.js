/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_ThrottledInputs */

const en_auth_two_factor_throttled = /** @type {(inputs: Auth_Two_Factor_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many attempts. Wait a minute before trying again.`)
};

const fr_auth_two_factor_throttled = /** @type {(inputs: Auth_Two_Factor_ThrottledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trop de tentatives. Patientez une minute avant de réessayer.`)
};

/**
* | output |
* | --- |
* | "Too many attempts. Wait a minute before trying again." |
*
* @param {Auth_Two_Factor_ThrottledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_throttled = /** @type {((inputs?: Auth_Two_Factor_ThrottledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_ThrottledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_throttled(inputs)
	return en_auth_two_factor_throttled(inputs)
});
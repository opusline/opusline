/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_SubmitInputs */

const en_auth_two_factor_submit = /** @type {(inputs: Auth_Two_Factor_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verify`)
};

const fr_auth_two_factor_submit = /** @type {(inputs: Auth_Two_Factor_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifier`)
};

/**
* | output |
* | --- |
* | "Verify" |
*
* @param {Auth_Two_Factor_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_submit = /** @type {((inputs?: Auth_Two_Factor_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_submit(inputs)
	return en_auth_two_factor_submit(inputs)
});
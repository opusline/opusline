/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_TitleInputs */

const en_auth_two_factor_title = /** @type {(inputs: Auth_Two_Factor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two-step verification`)
};

const fr_auth_two_factor_title = /** @type {(inputs: Auth_Two_Factor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérification en deux étapes`)
};

/**
* | output |
* | --- |
* | "Two-step verification" |
*
* @param {Auth_Two_Factor_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_title = /** @type {((inputs?: Auth_Two_Factor_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_title(inputs)
	return en_auth_two_factor_title(inputs)
});
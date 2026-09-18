/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_DescriptionInputs */

const en_auth_two_factor_description = /** @type {(inputs: Auth_Two_Factor_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One more step to confirm it is you.`)
};

const fr_auth_two_factor_description = /** @type {(inputs: Auth_Two_Factor_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une étape de plus pour confirmer que c'est bien vous.`)
};

/**
* | output |
* | --- |
* | "One more step to confirm it is you." |
*
* @param {Auth_Two_Factor_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_description = /** @type {((inputs?: Auth_Two_Factor_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_description(inputs)
	return en_auth_two_factor_description(inputs)
});
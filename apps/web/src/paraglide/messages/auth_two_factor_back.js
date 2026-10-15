/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_BackInputs */

const en_auth_two_factor_back = /** @type {(inputs: Auth_Two_Factor_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use another account`)
};

const fr_auth_two_factor_back = /** @type {(inputs: Auth_Two_Factor_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utiliser un autre compte`)
};

/**
* | output |
* | --- |
* | "Use another account" |
*
* @param {Auth_Two_Factor_BackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_back = /** @type {((inputs?: Auth_Two_Factor_BackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_BackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_two_factor_back(inputs)
	return en_auth_two_factor_back(inputs)
});
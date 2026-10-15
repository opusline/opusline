/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_DescriptionInputs */

const en_auth_reset_description = /** @type {(inputs: Auth_Reset_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It replaces the one you forgot and signs out every device still connected.`)
};

const fr_auth_reset_description = /** @type {(inputs: Auth_Reset_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il remplace celui que vous avez oublié et déconnecte tous les appareils encore connectés.`)
};

/**
* | output |
* | --- |
* | "It replaces the one you forgot and signs out every device still connected." |
*
* @param {Auth_Reset_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_description = /** @type {((inputs?: Auth_Reset_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_description(inputs)
	return en_auth_reset_description(inputs)
});
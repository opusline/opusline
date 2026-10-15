/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_TitleInputs */

const en_auth_reset_title = /** @type {(inputs: Auth_Reset_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a new password`)
};

const fr_auth_reset_title = /** @type {(inputs: Auth_Reset_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir un nouveau mot de passe`)
};

/**
* | output |
* | --- |
* | "Choose a new password" |
*
* @param {Auth_Reset_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_title = /** @type {((inputs?: Auth_Reset_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_title(inputs)
	return en_auth_reset_title(inputs)
});
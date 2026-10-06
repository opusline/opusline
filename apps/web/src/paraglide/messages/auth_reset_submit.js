/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_SubmitInputs */

const en_auth_reset_submit = /** @type {(inputs: Auth_Reset_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change my password`)
};

const fr_auth_reset_submit = /** @type {(inputs: Auth_Reset_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer mon mot de passe`)
};

/**
* | output |
* | --- |
* | "Change my password" |
*
* @param {Auth_Reset_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_submit = /** @type {((inputs?: Auth_Reset_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_submit(inputs)
	return en_auth_reset_submit(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Forgot_SubmitInputs */

const en_auth_forgot_submit = /** @type {(inputs: Auth_Forgot_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email me the link`)
};

const fr_auth_forgot_submit = /** @type {(inputs: Auth_Forgot_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`M'envoyer le lien`)
};

/**
* | output |
* | --- |
* | "Email me the link" |
*
* @param {Auth_Forgot_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_forgot_submit = /** @type {((inputs?: Auth_Forgot_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Forgot_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_forgot_submit(inputs)
	return en_auth_forgot_submit(inputs)
});
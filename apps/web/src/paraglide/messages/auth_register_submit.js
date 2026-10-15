/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Register_SubmitInputs */

const en_auth_register_submit = /** @type {(inputs: Auth_Register_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the account`)
};

const fr_auth_register_submit = /** @type {(inputs: Auth_Register_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer le compte`)
};

/**
* | output |
* | --- |
* | "Create the account" |
*
* @param {Auth_Register_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_register_submit = /** @type {((inputs?: Auth_Register_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Register_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_register_submit(inputs)
	return en_auth_register_submit(inputs)
});
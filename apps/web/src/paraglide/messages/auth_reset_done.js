/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_DoneInputs */

const en_auth_reset_done = /** @type {(inputs: Auth_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your password has been changed. You can now sign in with it.`)
};

const fr_auth_reset_done = /** @type {(inputs: Auth_Reset_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter avec.`)
};

/**
* | output |
* | --- |
* | "Your password has been changed. You can now sign in with it." |
*
* @param {Auth_Reset_DoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_reset_done = /** @type {((inputs?: Auth_Reset_DoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Reset_DoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_reset_done(inputs)
	return en_auth_reset_done(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Reset_DoneInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter avec.")
	return /** @type {LocalizedString} */ ("Your password has been changed. You can now sign in with it.")
});
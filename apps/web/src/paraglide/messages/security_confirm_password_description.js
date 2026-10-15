/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Confirm_Password_DescriptionInputs */



/**
* | output |
* | --- |
* | "This change affects how you sign in. Enter your password to continue." |
*
* @param {Security_Confirm_Password_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_confirm_password_description = /** @type {((inputs?: Security_Confirm_Password_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Confirm_Password_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ce changement touche votre connexion. Saisissez votre mot de passe pour continuer.")
	return /** @type {LocalizedString} */ ("This change affects how you sign in. Enter your password to continue.")
});
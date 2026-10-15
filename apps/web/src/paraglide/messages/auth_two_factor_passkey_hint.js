/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Passkey_HintInputs */



/**
* | output |
* | --- |
* | "Confirm with the passkey saved on this device or in your password manager." |
*
* @param {Auth_Two_Factor_Passkey_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_passkey_hint = /** @type {((inputs?: Auth_Two_Factor_Passkey_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Passkey_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Confirmez avec la clé d'accès enregistrée sur cet appareil ou dans votre gestionnaire de mots de passe.")
	return /** @type {LocalizedString} */ ("Confirm with the passkey saved on this device or in your password manager.")
});
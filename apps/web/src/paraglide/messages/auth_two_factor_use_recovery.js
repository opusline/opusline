/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Two_Factor_Use_RecoveryInputs */



/**
* | output |
* | --- |
* | "Use a recovery code" |
*
* @param {Auth_Two_Factor_Use_RecoveryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const auth_two_factor_use_recovery = /** @type {((inputs?: Auth_Two_Factor_Use_RecoveryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Two_Factor_Use_RecoveryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Utiliser un code de secours")
	return /** @type {LocalizedString} */ ("Use a recovery code")
});
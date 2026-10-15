/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Revoke_All_Confirm_BodyInputs */



/**
* | output |
* | --- |
* | "Every browser, this one included, will be asked for a code at its next sign-in." |
*
* @param {Security_Trusted_Revoke_All_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_revoke_all_confirm_body = /** @type {((inputs?: Security_Trusted_Revoke_All_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Revoke_All_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Tous les navigateurs, celui-ci compris, devront saisir un code à leur prochaine connexion.")
	return /** @type {LocalizedString} */ ("Every browser, this one included, will be asked for a code at its next sign-in.")
});
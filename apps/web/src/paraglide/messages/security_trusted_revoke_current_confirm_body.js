/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Revoke_Current_Confirm_BodyInputs */

const en_security_trusted_revoke_current_confirm_body = /** @type {(inputs: Security_Trusted_Revoke_Current_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This is the browser you are using: you will be asked for a code at your next sign-in.`)
};

const fr_security_trusted_revoke_current_confirm_body = /** @type {(inputs: Security_Trusted_Revoke_Current_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`C'est le navigateur que vous utilisez : un code vous sera demandé à votre prochaine connexion.`)
};

/**
* | output |
* | --- |
* | "This is the browser you are using: you will be asked for a code at your next sign-in." |
*
* @param {Security_Trusted_Revoke_Current_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_revoke_current_confirm_body = /** @type {((inputs?: Security_Trusted_Revoke_Current_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Revoke_Current_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_revoke_current_confirm_body(inputs)
	return en_security_trusted_revoke_current_confirm_body(inputs)
});
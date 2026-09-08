/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Revoke_Confirm_BodyInputs */

const en_security_trusted_revoke_confirm_body = /** @type {(inputs: Security_Trusted_Revoke_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It will be asked for a code at its next sign-in.`)
};

const fr_security_trusted_revoke_confirm_body = /** @type {(inputs: Security_Trusted_Revoke_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un code lui sera demandé à sa prochaine connexion.`)
};

/**
* | output |
* | --- |
* | "It will be asked for a code at its next sign-in." |
*
* @param {Security_Trusted_Revoke_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_revoke_confirm_body = /** @type {((inputs?: Security_Trusted_Revoke_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Revoke_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_revoke_confirm_body(inputs)
	return en_security_trusted_revoke_confirm_body(inputs)
});
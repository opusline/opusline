/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Revoke_Confirm_BodyInputs */

const en_security_token_revoke_confirm_body = /** @type {(inputs: Security_Token_Revoke_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The application using it is refused from its next request on.`)
};

const fr_security_token_revoke_confirm_body = /** @type {(inputs: Security_Token_Revoke_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'application qui l'utilise sera refusée dès sa prochaine requête.`)
};

/**
* | output |
* | --- |
* | "The application using it is refused from its next request on." |
*
* @param {Security_Token_Revoke_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_revoke_confirm_body = /** @type {((inputs?: Security_Token_Revoke_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Revoke_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_revoke_confirm_body(inputs)
	return en_security_token_revoke_confirm_body(inputs)
});
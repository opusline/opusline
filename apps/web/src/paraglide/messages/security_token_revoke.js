/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_RevokeInputs */

const en_security_token_revoke = /** @type {(inputs: Security_Token_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke`)
};

const fr_security_token_revoke = /** @type {(inputs: Security_Token_RevokeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Révoquer`)
};

/**
* | output |
* | --- |
* | "Revoke" |
*
* @param {Security_Token_RevokeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_revoke = /** @type {((inputs?: Security_Token_RevokeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_RevokeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_revoke(inputs)
	return en_security_token_revoke(inputs)
});
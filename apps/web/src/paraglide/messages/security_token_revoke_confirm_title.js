/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Token_Revoke_Confirm_TitleInputs */

const en_security_token_revoke_confirm_title = /** @type {(inputs: Security_Token_Revoke_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke this token?`)
};

const fr_security_token_revoke_confirm_title = /** @type {(inputs: Security_Token_Revoke_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Révoquer ce jeton ?`)
};

/**
* | output |
* | --- |
* | "Revoke this token?" |
*
* @param {Security_Token_Revoke_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_token_revoke_confirm_title = /** @type {((inputs?: Security_Token_Revoke_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Token_Revoke_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_token_revoke_confirm_title(inputs)
	return en_security_token_revoke_confirm_title(inputs)
});
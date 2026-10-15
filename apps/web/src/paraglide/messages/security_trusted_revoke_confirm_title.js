/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Revoke_Confirm_TitleInputs */

const en_security_trusted_revoke_confirm_title = /** @type {(inputs: Security_Trusted_Revoke_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke this browser?`)
};

const fr_security_trusted_revoke_confirm_title = /** @type {(inputs: Security_Trusted_Revoke_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Révoquer ce navigateur ?`)
};

/**
* | output |
* | --- |
* | "Revoke this browser?" |
*
* @param {Security_Trusted_Revoke_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_revoke_confirm_title = /** @type {((inputs?: Security_Trusted_Revoke_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Revoke_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_revoke_confirm_title(inputs)
	return en_security_trusted_revoke_confirm_title(inputs)
});
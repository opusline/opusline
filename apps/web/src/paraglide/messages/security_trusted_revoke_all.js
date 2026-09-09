/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Trusted_Revoke_AllInputs */

const en_security_trusted_revoke_all = /** @type {(inputs: Security_Trusted_Revoke_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revoke all`)
};

const fr_security_trusted_revoke_all = /** @type {(inputs: Security_Trusted_Revoke_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout révoquer`)
};

/**
* | output |
* | --- |
* | "Revoke all" |
*
* @param {Security_Trusted_Revoke_AllInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_trusted_revoke_all = /** @type {((inputs?: Security_Trusted_Revoke_AllInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Trusted_Revoke_AllInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_trusted_revoke_all(inputs)
	return en_security_trusted_revoke_all(inputs)
});
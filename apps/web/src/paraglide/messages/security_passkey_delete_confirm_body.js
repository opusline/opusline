/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Delete_Confirm_BodyInputs */

const en_security_passkey_delete_confirm_body = /** @type {(inputs: Security_Passkey_Delete_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It will no longer sign you in. If it is your last second factor, the recovery codes and the trusted browsers go with it.`)
};

const fr_security_passkey_delete_confirm_body = /** @type {(inputs: Security_Passkey_Delete_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elle ne permettra plus de vous connecter. Si c'est votre dernier second facteur, les codes de secours et les navigateurs de confiance disparaissent avec elle.`)
};

/**
* | output |
* | --- |
* | "It will no longer sign you in. If it is your last second factor, the recovery codes and the trusted browsers go with it." |
*
* @param {Security_Passkey_Delete_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_delete_confirm_body = /** @type {((inputs?: Security_Passkey_Delete_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Delete_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_delete_confirm_body(inputs)
	return en_security_passkey_delete_confirm_body(inputs)
});
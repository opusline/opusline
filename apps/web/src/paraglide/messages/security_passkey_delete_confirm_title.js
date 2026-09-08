/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Passkey_Delete_Confirm_TitleInputs */

const en_security_passkey_delete_confirm_title = /** @type {(inputs: Security_Passkey_Delete_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this passkey?`)
};

const fr_security_passkey_delete_confirm_title = /** @type {(inputs: Security_Passkey_Delete_Confirm_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette clé d'accès ?`)
};

/**
* | output |
* | --- |
* | "Delete this passkey?" |
*
* @param {Security_Passkey_Delete_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_passkey_delete_confirm_title = /** @type {((inputs?: Security_Passkey_Delete_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Passkey_Delete_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_security_passkey_delete_confirm_title(inputs)
	return en_security_passkey_delete_confirm_title(inputs)
});
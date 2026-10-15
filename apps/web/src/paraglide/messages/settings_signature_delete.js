/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_DeleteInputs */

const en_settings_signature_delete = /** @type {(inputs: Settings_Signature_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

const fr_settings_signature_delete = /** @type {(inputs: Settings_Signature_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer`)
};

/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Settings_Signature_DeleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_delete = /** @type {((inputs?: Settings_Signature_DeleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_DeleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_delete(inputs)
	return en_settings_signature_delete(inputs)
});
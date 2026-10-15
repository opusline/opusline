/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_RedoInputs */

const en_settings_signature_redo = /** @type {(inputs: Settings_Signature_RedoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Redo`)
};

const fr_settings_signature_redo = /** @type {(inputs: Settings_Signature_RedoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refaire`)
};

/**
* | output |
* | --- |
* | "Redo" |
*
* @param {Settings_Signature_RedoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_redo = /** @type {((inputs?: Settings_Signature_RedoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_RedoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_redo(inputs)
	return en_settings_signature_redo(inputs)
});
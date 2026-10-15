/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_DescriptionInputs */

const en_settings_signature_description = /** @type {(inputs: Settings_Signature_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign once — with the mouse, the trackpad or the keyboard by typing your name. Opusline applies it to every generated CRA and invoice.`)
};

const fr_settings_signature_description = /** @type {(inputs: Settings_Signature_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signez une fois — à la souris, au trackpad ou au clavier en saisissant votre nom. Opusline l'appose sur chaque CRA et chaque facture générés.`)
};

/**
* | output |
* | --- |
* | "Sign once — with the mouse, the trackpad or the keyboard by typing your name. Opusline applies it to every generated CRA and invoice." |
*
* @param {Settings_Signature_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_description = /** @type {((inputs?: Settings_Signature_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_description(inputs)
	return en_settings_signature_description(inputs)
});
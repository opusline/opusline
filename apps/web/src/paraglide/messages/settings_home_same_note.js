/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Home_Same_NoteInputs */

const en_settings_home_same_note = /** @type {(inputs: Settings_Home_Same_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your home address is the company's.`)
};

const fr_settings_home_same_note = /** @type {(inputs: Settings_Home_Same_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous êtes domicilié à l'adresse de la société.`)
};

/**
* | output |
* | --- |
* | "Your home address is the company's." |
*
* @param {Settings_Home_Same_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_home_same_note = /** @type {((inputs?: Settings_Home_Same_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Home_Same_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_home_same_note(inputs)
	return en_settings_home_same_note(inputs)
});
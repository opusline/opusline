/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ city: NonNullable<unknown> }} Settings_Made_At_NoteInputs */

const en_settings_made_at_note = /** @type {(inputs: Settings_Made_At_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`“Fait à ${i?.city}” will appear on signed documents.`)
};

const fr_settings_made_at_note = /** @type {(inputs: Settings_Made_At_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`« Fait à ${i?.city} » apparaîtra sur les documents signés.`)
};

/**
* | output |
* | --- |
* | "“Fait à {city}” will appear on signed documents." |
*
* @param {Settings_Made_At_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_made_at_note = /** @type {((inputs: Settings_Made_At_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Made_At_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_made_at_note(inputs)
	return en_settings_made_at_note(inputs)
});
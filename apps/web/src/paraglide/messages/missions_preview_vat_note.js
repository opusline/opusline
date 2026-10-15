/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Vat_NoteInputs */

const en_missions_preview_vat_note = /** @type {(inputs: Missions_Preview_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· VAT on top, to remit`)
};

const fr_missions_preview_vat_note = /** @type {(inputs: Missions_Preview_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· TVA en sus, à reverser`)
};

/**
* | output |
* | --- |
* | "· VAT on top, to remit" |
*
* @param {Missions_Preview_Vat_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_vat_note = /** @type {((inputs?: Missions_Preview_Vat_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Vat_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_vat_note(inputs)
	return en_missions_preview_vat_note(inputs)
});
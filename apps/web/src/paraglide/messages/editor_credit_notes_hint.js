/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Credit_Notes_HintInputs */

const en_editor_credit_notes_hint = /** @type {(inputs: Editor_Credit_Notes_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deducted from what this invoice asks when it is validated; the client pays the rest.`)
};

const fr_editor_credit_notes_hint = /** @type {(inputs: Editor_Credit_Notes_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déduits de ce que demande cette facture à sa validation ; le client paie le reste.`)
};

/**
* | output |
* | --- |
* | "Deducted from what this invoice asks when it is validated; the client pays the rest." |
*
* @param {Editor_Credit_Notes_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_credit_notes_hint = /** @type {((inputs?: Editor_Credit_Notes_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Credit_Notes_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_credit_notes_hint(inputs)
	return en_editor_credit_notes_hint(inputs)
});
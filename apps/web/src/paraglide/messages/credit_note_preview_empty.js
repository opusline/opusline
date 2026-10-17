/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Preview_EmptyInputs */

const en_credit_note_preview_empty = /** @type {(inputs: Credit_Note_Preview_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a reason to see the credit note.`)
};

const fr_credit_note_preview_empty = /** @type {(inputs: Credit_Note_Preview_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez un motif pour voir l'avoir.`)
};

/**
* | output |
* | --- |
* | "Choose a reason to see the credit note." |
*
* @param {Credit_Note_Preview_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_preview_empty = /** @type {((inputs?: Credit_Note_Preview_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Preview_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_preview_empty(inputs)
	return en_credit_note_preview_empty(inputs)
});
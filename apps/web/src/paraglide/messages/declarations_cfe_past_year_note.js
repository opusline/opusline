/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Past_Year_NoteInputs */

const en_declarations_cfe_past_year_note = /** @type {(inputs: Declarations_Cfe_Past_Year_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`a past year's bill is what was paid; only the payment date is kept`)
};

const fr_declarations_cfe_past_year_note = /** @type {(inputs: Declarations_Cfe_Past_Year_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`la cotisation d'une année passée est ce qui a été payé ; seule la date du paiement est conservée`)
};

/**
* | output |
* | --- |
* | "a past year's bill is what was paid; only the payment date is kept" |
*
* @param {Declarations_Cfe_Past_Year_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_past_year_note = /** @type {((inputs?: Declarations_Cfe_Past_Year_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Past_Year_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_past_year_note(inputs)
	return en_declarations_cfe_past_year_note(inputs)
});
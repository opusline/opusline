/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Ca3_Mixed_NoteInputs */

const en_declarations_ca3_mixed_note = /** @type {(inputs: Declarations_Ca3_Mixed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your month mixes VAT rates: split the base and the tax across lines 08, 9B or 09 yourself.`)
};

const fr_declarations_ca3_mixed_note = /** @type {(inputs: Declarations_Ca3_Mixed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre mois mêle plusieurs taux : ventilez la base et la taxe sur les lignes 08, 9B ou 09 correspondantes.`)
};

/**
* | output |
* | --- |
* | "Your month mixes VAT rates: split the base and the tax across lines 08, 9B or 09 yourself." |
*
* @param {Declarations_Ca3_Mixed_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_mixed_note = /** @type {((inputs?: Declarations_Ca3_Mixed_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Mixed_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_mixed_note(inputs)
	return en_declarations_ca3_mixed_note(inputs)
});
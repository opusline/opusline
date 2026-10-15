/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Progressive_NoteInputs */



/**
* | output |
* | --- |
* | "This income joins the household's progressive scale; the tax depends on its other income." |
*
* @param {Declarations_Income_Tax_Progressive_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_progressive_note = /** @type {((inputs?: Declarations_Income_Tax_Progressive_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Progressive_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ce revenu rejoint le barème progressif du foyer ; l'impôt dépend de ses autres revenus.")
	return /** @type {LocalizedString} */ ("This income joins the household's progressive scale; the tax depends on its other income.")
});
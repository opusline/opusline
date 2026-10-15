/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Liberating_NoteInputs */

const en_declarations_income_tax_liberating_note = /** @type {(inputs: Declarations_Income_Tax_Liberating_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The versement libératoire (2.2 % of revenue) stands as the tax on this income; the 2042-C PRO adds nothing on top.`)
};

const fr_declarations_income_tax_liberating_note = /** @type {(inputs: Declarations_Income_Tax_Liberating_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le versement libératoire (2,2 % du CA) tient lieu d'impôt sur ces revenus ; la 2042-C PRO ne génère pas de complément.`)
};

/**
* | output |
* | --- |
* | "The versement libératoire (2.2 % of revenue) stands as the tax on this income; the 2042-C PRO adds nothing on top." |
*
* @param {Declarations_Income_Tax_Liberating_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_liberating_note = /** @type {((inputs?: Declarations_Income_Tax_Liberating_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Liberating_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_liberating_note(inputs)
	return en_declarations_income_tax_liberating_note(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Notice_NoteInputs */

const en_declarations_cfe_notice_note = /** @type {(inputs: Declarations_Cfe_Notice_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`amount entered from the notice`)
};

const fr_declarations_cfe_notice_note = /** @type {(inputs: Declarations_Cfe_Notice_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`montant saisi depuis l'avis`)
};

/**
* | output |
* | --- |
* | "amount entered from the notice" |
*
* @param {Declarations_Cfe_Notice_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_notice_note = /** @type {((inputs?: Declarations_Cfe_Notice_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Notice_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_notice_note(inputs)
	return en_declarations_cfe_notice_note(inputs)
});
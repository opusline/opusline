/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_UndoInputs */

const en_declarations_undo = /** @type {(inputs: Declarations_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo`)
};

const fr_declarations_undo = /** @type {(inputs: Declarations_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler`)
};

/**
* | output |
* | --- |
* | "Undo" |
*
* @param {Declarations_UndoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_undo = /** @type {((inputs?: Declarations_UndoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_UndoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_undo(inputs)
	return en_declarations_undo(inputs)
});
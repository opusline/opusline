/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Declared_UndoInputs */

const en_expenses_declared_undo = /** @type {(inputs: Expenses_Declared_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo the filing mark`)
};

const fr_expenses_declared_undo = /** @type {(inputs: Expenses_Declared_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler le marquage`)
};

/**
* | output |
* | --- |
* | "Undo the filing mark" |
*
* @param {Expenses_Declared_UndoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_declared_undo = /** @type {((inputs?: Expenses_Declared_UndoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Declared_UndoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_declared_undo(inputs)
	return en_expenses_declared_undo(inputs)
});
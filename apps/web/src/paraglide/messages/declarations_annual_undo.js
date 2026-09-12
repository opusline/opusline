/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_UndoInputs */

const en_declarations_annual_undo = /** @type {(inputs: Declarations_Annual_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the mark`)
};

const fr_declarations_annual_undo = /** @type {(inputs: Declarations_Annual_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuler le marquage`)
};

/**
* | output |
* | --- |
* | "Remove the mark" |
*
* @param {Declarations_Annual_UndoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_undo = /** @type {((inputs?: Declarations_Annual_UndoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_UndoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_undo(inputs)
	return en_declarations_annual_undo(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Declared_Undo_FailedInputs */

const en_expenses_declared_undo_failed = /** @type {(inputs: Expenses_Declared_Undo_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The mark could not be removed. Try again in a moment.`)
};

const fr_expenses_declared_undo_failed = /** @type {(inputs: Expenses_Declared_Undo_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le marquage n'a pas pu être annulé. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The mark could not be removed. Try again in a moment." |
*
* @param {Expenses_Declared_Undo_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_declared_undo_failed = /** @type {((inputs?: Expenses_Declared_Undo_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Declared_Undo_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_declared_undo_failed(inputs)
	return en_expenses_declared_undo_failed(inputs)
});
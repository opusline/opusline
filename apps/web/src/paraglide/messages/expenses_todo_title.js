/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Todo_TitleInputs */

const en_expenses_todo_title = /** @type {(inputs: Expenses_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To handle`)
};

const fr_expenses_todo_title = /** @type {(inputs: Expenses_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À traiter`)
};

/**
* | output |
* | --- |
* | "To handle" |
*
* @param {Expenses_Todo_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_title = /** @type {((inputs?: Expenses_Todo_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_title(inputs)
	return en_expenses_todo_title(inputs)
});
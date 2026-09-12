/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Todo_CreateInputs */

const en_expenses_todo_create = /** @type {(inputs: Expenses_Todo_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the expense`)
};

const fr_expenses_todo_create = /** @type {(inputs: Expenses_Todo_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer la dépense`)
};

/**
* | output |
* | --- |
* | "Create the expense" |
*
* @param {Expenses_Todo_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_create = /** @type {((inputs?: Expenses_Todo_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_create(inputs)
	return en_expenses_todo_create(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Expenses_Todo_Annual_SubInputs */

const en_expenses_todo_annual_sub = /** @type {(inputs: Expenses_Todo_Annual_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Next debit on ${i?.date}.`)
};

const fr_expenses_todo_annual_sub = /** @type {(inputs: Expenses_Todo_Annual_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prochain prélèvement le ${i?.date}.`)
};

/**
* | output |
* | --- |
* | "Next debit on {date}." |
*
* @param {Expenses_Todo_Annual_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_annual_sub = /** @type {((inputs: Expenses_Todo_Annual_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_Annual_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_annual_sub(inputs)
	return en_expenses_todo_annual_sub(inputs)
});
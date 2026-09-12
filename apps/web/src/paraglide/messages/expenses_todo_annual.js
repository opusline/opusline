/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Expenses_Todo_AnnualInputs */

const en_expenses_todo_annual = /** @type {(inputs: Expenses_Todo_AnnualInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · annual debit`)
};

const fr_expenses_todo_annual = /** @type {(inputs: Expenses_Todo_AnnualInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · échéance annuelle`)
};

/**
* | output |
* | --- |
* | "{supplier} · annual debit" |
*
* @param {Expenses_Todo_AnnualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_annual = /** @type {((inputs: Expenses_Todo_AnnualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_AnnualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_annual(inputs)
	return en_expenses_todo_annual(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ consumed: NonNullable<unknown>, forfait: NonNullable<unknown>, over: NonNullable<unknown> }} Invoices_Todo_Budget_Exceeded_DetailInputs */

const en_invoices_todo_budget_exceeded_detail = /** @type {(inputs: Invoices_Todo_Budget_Exceeded_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.consumed} of time against a ${i?.forfait} fixed price · ${i?.over} beyond`)
};

const fr_invoices_todo_budget_exceeded_detail = /** @type {(inputs: Invoices_Todo_Budget_Exceeded_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.consumed} de temps sur un forfait de ${i?.forfait} · ${i?.over} au-delà`)
};

/**
* | output |
* | --- |
* | "{consumed} of time against a {forfait} fixed price · {over} beyond" |
*
* @param {Invoices_Todo_Budget_Exceeded_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_budget_exceeded_detail = /** @type {((inputs: Invoices_Todo_Budget_Exceeded_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Budget_Exceeded_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_budget_exceeded_detail(inputs)
	return en_invoices_todo_budget_exceeded_detail(inputs)
});
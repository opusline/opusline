/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_EmptyInputs */

const en_invoices_todo_empty = /** @type {(inputs: Invoices_Todo_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everything is invoiced and collected.`)
};

const fr_invoices_todo_empty = /** @type {(inputs: Invoices_Todo_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tout est facturé et encaissé.`)
};

/**
* | output |
* | --- |
* | "Everything is invoiced and collected." |
*
* @param {Invoices_Todo_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_empty = /** @type {((inputs?: Invoices_Todo_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_empty(inputs)
	return en_invoices_todo_empty(inputs)
});
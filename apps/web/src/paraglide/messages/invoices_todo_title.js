/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_TitleInputs */

const en_invoices_todo_title = /** @type {(inputs: Invoices_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To handle`)
};

const fr_invoices_todo_title = /** @type {(inputs: Invoices_Todo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À traiter`)
};

/**
* | output |
* | --- |
* | "To handle" |
*
* @param {Invoices_Todo_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_title = /** @type {((inputs?: Invoices_Todo_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_title(inputs)
	return en_invoices_todo_title(inputs)
});
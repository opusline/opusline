/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoices_Step_DueInputs */

const en_invoices_step_due = /** @type {(inputs: Invoices_Step_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expected ${i?.date}`)
};

const fr_invoices_step_due = /** @type {(inputs: Invoices_Step_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`prévue le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "expected {date}" |
*
* @param {Invoices_Step_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_step_due = /** @type {((inputs: Invoices_Step_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Step_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_step_due(inputs)
	return en_invoices_step_due(inputs)
});
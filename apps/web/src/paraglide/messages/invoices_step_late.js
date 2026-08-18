/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown>, count: NonNullable<unknown> }} Invoices_Step_LateInputs */

const en_invoices_step_late = /** @type {(inputs: Invoices_Step_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`expected ${i?.date} · ${i?.count} d ago`)
};

const fr_invoices_step_late = /** @type {(inputs: Invoices_Step_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`prévue le ${i?.date} · il y a ${i?.count} j`)
};

/**
* | output |
* | --- |
* | "expected {date} · {count} d ago" |
*
* @param {Invoices_Step_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_step_late = /** @type {((inputs: Invoices_Step_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Step_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_step_late(inputs)
	return en_invoices_step_late(inputs)
});
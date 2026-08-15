/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Invoices_State_Paid_InInputs */

const en_invoices_state_paid_in = /** @type {(inputs: Invoices_State_Paid_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`paid in ${i?.days} d`)
};

const fr_invoices_state_paid_in = /** @type {(inputs: Invoices_State_Paid_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`payée en ${i?.days} j`)
};

/**
* | output |
* | --- |
* | "paid in {days} d" |
*
* @param {Invoices_State_Paid_InInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_state_paid_in = /** @type {((inputs: Invoices_State_Paid_InInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_State_Paid_InInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_state_paid_in(inputs)
	return en_invoices_state_paid_in(inputs)
});
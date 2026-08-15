/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoices_State_DueInputs */

const en_invoices_state_due = /** @type {(inputs: Invoices_State_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`due ${i?.date}`)
};

const fr_invoices_state_due = /** @type {(inputs: Invoices_State_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`échéance ${i?.date}`)
};

/**
* | output |
* | --- |
* | "due {date}" |
*
* @param {Invoices_State_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_state_due = /** @type {((inputs: Invoices_State_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_State_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_state_due(inputs)
	return en_invoices_state_due(inputs)
});
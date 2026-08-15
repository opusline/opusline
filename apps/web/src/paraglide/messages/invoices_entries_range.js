/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ first: NonNullable<unknown>, last: NonNullable<unknown> }} Invoices_Entries_RangeInputs */

const en_invoices_entries_range = /** @type {(inputs: Invoices_Entries_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Entries from ${i?.first} to ${i?.last}`)
};

const fr_invoices_entries_range = /** @type {(inputs: Invoices_Entries_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Entrées du ${i?.first} au ${i?.last}`)
};

/**
* | output |
* | --- |
* | "Entries from {first} to {last}" |
*
* @param {Invoices_Entries_RangeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_entries_range = /** @type {((inputs: Invoices_Entries_RangeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Entries_RangeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_entries_range(inputs)
	return en_invoices_entries_range(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoices_Entries_OnInputs */

const en_invoices_entries_on = /** @type {(inputs: Invoices_Entries_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Entries on ${i?.date}`)
};

const fr_invoices_entries_on = /** @type {(inputs: Invoices_Entries_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Entrées du ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Entries on {date}" |
*
* @param {Invoices_Entries_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_entries_on = /** @type {((inputs: Invoices_Entries_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Entries_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_entries_on(inputs)
	return en_invoices_entries_on(inputs)
});
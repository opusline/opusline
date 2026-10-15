/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_Hint_InvoicesInputs */



/**
* | output |
* | --- |
* | "PNG or SVG, transparent background. Appears on invoices." |
*
* @param {Clients_Logo_Hint_InvoicesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_hint_invoices = /** @type {((inputs?: Clients_Logo_Hint_InvoicesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_Hint_InvoicesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("PNG ou SVG, fond transparent. Apparaît sur les factures.")
	return /** @type {LocalizedString} */ ("PNG or SVG, transparent background. Appears on invoices.")
});
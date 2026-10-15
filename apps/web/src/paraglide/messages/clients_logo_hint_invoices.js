/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_Hint_InvoicesInputs */

const en_clients_logo_hint_invoices = /** @type {(inputs: Clients_Logo_Hint_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG or SVG, transparent background. Appears on invoices.`)
};

const fr_clients_logo_hint_invoices = /** @type {(inputs: Clients_Logo_Hint_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG ou SVG, fond transparent. Apparaît sur les factures.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_hint_invoices(inputs)
	return en_clients_logo_hint_invoices(inputs)
});
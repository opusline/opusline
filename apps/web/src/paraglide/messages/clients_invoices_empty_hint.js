/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Invoices_Empty_HintInputs */

const en_clients_invoices_empty_hint = /** @type {(inputs: Clients_Invoices_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices will appear here as soon as billable time is tracked on one of this client's missions.`)
};

const fr_clients_invoices_empty_hint = /** @type {(inputs: Clients_Invoices_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les factures apparaîtront ici dès que du temps facturable aura été saisi sur une mission de ce client.`)
};

/**
* | output |
* | --- |
* | "Invoices will appear here as soon as billable time is tracked on one of this client's missions." |
*
* @param {Clients_Invoices_Empty_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_invoices_empty_hint = /** @type {((inputs?: Clients_Invoices_Empty_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Invoices_Empty_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_invoices_empty_hint(inputs)
	return en_clients_invoices_empty_hint(inputs)
});
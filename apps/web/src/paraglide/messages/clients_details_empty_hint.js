/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Details_Empty_HintInputs */



/**
* | output |
* | --- |
* | "SIRET, VAT and address are needed to issue an invoice to this client." |
*
* @param {Clients_Details_Empty_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_details_empty_hint = /** @type {((inputs?: Clients_Details_Empty_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Details_Empty_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("SIRET, TVA et adresse sont nécessaires pour émettre une facture à ce client.")
	return /** @type {LocalizedString} */ ("SIRET, VAT and address are needed to issue an invoice to this client.")
});
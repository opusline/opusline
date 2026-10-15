/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reference_HintInputs */



/**
* | output |
* | --- |
* | "The one on the invoice issued elsewhere. Leave empty for a draft." |
*
* @param {Invoices_Reference_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reference_hint = /** @type {((inputs?: Invoices_Reference_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reference_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Celle de la facture émise ailleurs. Laissez vide pour un brouillon.")
	return /** @type {LocalizedString} */ ("The one on the invoice issued elsewhere. Leave empty for a draft.")
});
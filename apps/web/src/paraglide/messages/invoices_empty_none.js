/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Empty_NoneInputs */



/**
* | output |
* | --- |
* | "Invoices are edited elsewhere. Add one to track what is invoiced and what has been collected." |
*
* @param {Invoices_Empty_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_empty_none = /** @type {((inputs?: Invoices_Empty_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Empty_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les factures sont éditées ailleurs. Ajoutez-en une pour suivre ce qui est facturé et ce qui est encaissé.")
	return /** @type {LocalizedString} */ ("Invoices are edited elsewhere. Add one to track what is invoiced and what has been collected.")
});
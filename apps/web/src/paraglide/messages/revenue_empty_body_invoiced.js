/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Empty_Body_InvoicedInputs */



/**
* | output |
* | --- |
* | "No invoice was issued over this period." |
*
* @param {Revenue_Empty_Body_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_body_invoiced = /** @type {((inputs?: Revenue_Empty_Body_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_Body_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucune facture n'a été émise sur cette période.")
	return /** @type {LocalizedString} */ ("No invoice was issued over this period.")
});
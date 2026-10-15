/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Franchise_NoteInputs */



/**
* | output |
* | --- |
* | "Your invoices carry the notice “TVA non applicable, art. 293 B du CGI”." |
*
* @param {Vat_Regime_Franchise_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_franchise_note = /** @type {((inputs?: Vat_Regime_Franchise_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Franchise_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Vos factures portent la mention « TVA non applicable, art. 293 B du CGI ».")
	return /** @type {LocalizedString} */ ("Your invoices carry the notice “TVA non applicable, art. 293 B du CGI”.")
});
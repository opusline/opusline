/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Simplified_NoteInputs */



/**
* | output |
* | --- |
* | "Your invoices carry VAT and a CA12 return is expected every year, with instalments." |
*
* @param {Vat_Regime_Simplified_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_simplified_note = /** @type {((inputs?: Vat_Regime_Simplified_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Simplified_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Vos factures portent la TVA et une déclaration CA12 est attendue chaque année, avec acomptes.")
	return /** @type {LocalizedString} */ ("Your invoices carry VAT and a CA12 return is expected every year, with instalments.")
});
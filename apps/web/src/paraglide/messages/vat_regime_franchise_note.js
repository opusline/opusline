/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Franchise_NoteInputs */

const en_vat_regime_franchise_note = /** @type {(inputs: Vat_Regime_Franchise_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your invoices carry the notice “TVA non applicable, art. 293 B du CGI”.`)
};

const fr_vat_regime_franchise_note = /** @type {(inputs: Vat_Regime_Franchise_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos factures portent la mention « TVA non applicable, art. 293 B du CGI ».`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_franchise_note(inputs)
	return en_vat_regime_franchise_note(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Normal_NoteInputs */

const en_vat_regime_normal_note = /** @type {(inputs: Vat_Regime_Normal_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your invoices carry VAT and a CA3 return is expected every month.`)
};

const fr_vat_regime_normal_note = /** @type {(inputs: Vat_Regime_Normal_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos factures portent la TVA et une déclaration CA3 est attendue chaque mois.`)
};

/**
* | output |
* | --- |
* | "Your invoices carry VAT and a CA3 return is expected every month." |
*
* @param {Vat_Regime_Normal_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_normal_note = /** @type {((inputs?: Vat_Regime_Normal_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Normal_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_normal_note(inputs)
	return en_vat_regime_normal_note(inputs)
});
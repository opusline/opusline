/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Empty_None_OpuslineInputs */

const en_invoices_empty_none_opusline = /** @type {(inputs: Invoices_Empty_None_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create your first invoice: Opusline numbers it, renders the PDF and tracks what is collected.`)
};

const fr_invoices_empty_none_opusline = /** @type {(inputs: Invoices_Empty_None_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez votre première facture : Opusline la numérote, génère le PDF et suit ce qui est encaissé.`)
};

/**
* | output |
* | --- |
* | "Create your first invoice: Opusline numbers it, renders the PDF and tracks what is collected." |
*
* @param {Invoices_Empty_None_OpuslineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_empty_none_opusline = /** @type {((inputs?: Invoices_Empty_None_OpuslineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Empty_None_OpuslineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_empty_none_opusline(inputs)
	return en_invoices_empty_none_opusline(inputs)
});
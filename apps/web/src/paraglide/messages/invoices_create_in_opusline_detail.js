/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_In_Opusline_DetailInputs */

const en_invoices_create_in_opusline_detail = /** @type {(inputs: Invoices_Create_In_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Form and live preview. Opusline numbers it, renders the PDF and tracks its payment.`)
};

const fr_invoices_create_in_opusline_detail = /** @type {(inputs: Invoices_Create_In_Opusline_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formulaire et aperçu en direct. Opusline la numérote, génère le PDF et en suit l'encaissement.`)
};

/**
* | output |
* | --- |
* | "Form and live preview. Opusline numbers it, renders the PDF and tracks its payment." |
*
* @param {Invoices_Create_In_Opusline_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_in_opusline_detail = /** @type {((inputs?: Invoices_Create_In_Opusline_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_In_Opusline_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_in_opusline_detail(inputs)
	return en_invoices_create_in_opusline_detail(inputs)
});
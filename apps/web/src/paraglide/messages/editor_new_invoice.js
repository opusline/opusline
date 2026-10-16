/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_New_InvoiceInputs */

const en_editor_new_invoice = /** @type {(inputs: Editor_New_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New invoice`)
};

const fr_editor_new_invoice = /** @type {(inputs: Editor_New_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouvelle facture`)
};

/**
* | output |
* | --- |
* | "New invoice" |
*
* @param {Editor_New_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_new_invoice = /** @type {((inputs?: Editor_New_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_New_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_new_invoice(inputs)
	return en_editor_new_invoice(inputs)
});
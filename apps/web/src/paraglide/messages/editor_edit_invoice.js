/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Edit_InvoiceInputs */

const en_editor_edit_invoice = /** @type {(inputs: Editor_Edit_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the draft invoice`)
};

const fr_editor_edit_invoice = /** @type {(inputs: Editor_Edit_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le brouillon de facture`)
};

/**
* | output |
* | --- |
* | "Edit the draft invoice" |
*
* @param {Editor_Edit_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_edit_invoice = /** @type {((inputs?: Editor_Edit_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Edit_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_edit_invoice(inputs)
	return en_editor_edit_invoice(inputs)
});
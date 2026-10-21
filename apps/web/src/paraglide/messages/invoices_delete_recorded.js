/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Delete_RecordedInputs */

const en_invoices_delete_recorded = /** @type {(inputs: Invoices_Delete_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the invoice`)
};

const fr_invoices_delete_recorded = /** @type {(inputs: Invoices_Delete_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer la facture`)
};

/**
* | output |
* | --- |
* | "Delete the invoice" |
*
* @param {Invoices_Delete_RecordedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_recorded = /** @type {((inputs?: Invoices_Delete_RecordedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_RecordedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_recorded(inputs)
	return en_invoices_delete_recorded(inputs)
});
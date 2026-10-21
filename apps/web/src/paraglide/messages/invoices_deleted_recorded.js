/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Deleted_RecordedInputs */

const en_invoices_deleted_recorded = /** @type {(inputs: Invoices_Deleted_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice deleted`)
};

const fr_invoices_deleted_recorded = /** @type {(inputs: Invoices_Deleted_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture supprimée`)
};

/**
* | output |
* | --- |
* | "Invoice deleted" |
*
* @param {Invoices_Deleted_RecordedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_deleted_recorded = /** @type {((inputs?: Invoices_Deleted_RecordedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Deleted_RecordedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_deleted_recorded(inputs)
	return en_invoices_deleted_recorded(inputs)
});
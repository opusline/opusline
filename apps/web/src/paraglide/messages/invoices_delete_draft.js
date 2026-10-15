/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Delete_DraftInputs */

const en_invoices_delete_draft = /** @type {(inputs: Invoices_Delete_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the draft`)
};

const fr_invoices_delete_draft = /** @type {(inputs: Invoices_Delete_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer le brouillon`)
};

/**
* | output |
* | --- |
* | "Delete the draft" |
*
* @param {Invoices_Delete_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_draft = /** @type {((inputs?: Invoices_Delete_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_draft(inputs)
	return en_invoices_delete_draft(inputs)
});
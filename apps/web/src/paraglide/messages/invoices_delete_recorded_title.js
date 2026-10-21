/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Delete_Recorded_TitleInputs */

const en_invoices_delete_recorded_title = /** @type {(inputs: Invoices_Delete_Recorded_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this invoice?`)
};

const fr_invoices_delete_recorded_title = /** @type {(inputs: Invoices_Delete_Recorded_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette facture ?`)
};

/**
* | output |
* | --- |
* | "Delete this invoice?" |
*
* @param {Invoices_Delete_Recorded_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_recorded_title = /** @type {((inputs?: Invoices_Delete_Recorded_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_Recorded_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_recorded_title(inputs)
	return en_invoices_delete_recorded_title(inputs)
});
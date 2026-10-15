/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Delete_TitleInputs */

const en_invoices_delete_title = /** @type {(inputs: Invoices_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this draft?`)
};

const fr_invoices_delete_title = /** @type {(inputs: Invoices_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce brouillon ?`)
};

/**
* | output |
* | --- |
* | "Delete this draft?" |
*
* @param {Invoices_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_title = /** @type {((inputs?: Invoices_Delete_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_title(inputs)
	return en_invoices_delete_title(inputs)
});
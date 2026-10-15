/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_TitleInputs */

const en_invoices_add_title = /** @type {(inputs: Invoices_Add_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an invoice`)
};

const fr_invoices_add_title = /** @type {(inputs: Invoices_Add_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une facture`)
};

/**
* | output |
* | --- |
* | "Add an invoice" |
*
* @param {Invoices_Add_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_title = /** @type {((inputs?: Invoices_Add_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_title(inputs)
	return en_invoices_add_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_TitleInputs */

const en_invoices_create_title = /** @type {(inputs: Invoices_Create_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the invoice`)
};

const fr_invoices_create_title = /** @type {(inputs: Invoices_Create_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer la facture`)
};

/**
* | output |
* | --- |
* | "Create the invoice" |
*
* @param {Invoices_Create_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_title = /** @type {((inputs?: Invoices_Create_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_title(inputs)
	return en_invoices_create_title(inputs)
});
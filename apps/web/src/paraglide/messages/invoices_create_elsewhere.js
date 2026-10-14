/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Create_ElsewhereInputs */

const en_invoices_create_elsewhere = /** @type {(inputs: Invoices_Create_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an invoice issued elsewhere`)
};

const fr_invoices_create_elsewhere = /** @type {(inputs: Invoices_Create_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une facture émise ailleurs`)
};

/**
* | output |
* | --- |
* | "Add an invoice issued elsewhere" |
*
* @param {Invoices_Create_ElsewhereInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_create_elsewhere = /** @type {((inputs?: Invoices_Create_ElsewhereInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Create_ElsewhereInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_create_elsewhere(inputs)
	return en_invoices_create_elsewhere(inputs)
});
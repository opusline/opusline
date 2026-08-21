/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Number_RequiredInputs */

const en_invoices_add_number_required = /** @type {(inputs: Invoices_Add_Number_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A sent or paid invoice carries the reference of the document that was issued.`)
};

const fr_invoices_add_number_required = /** @type {(inputs: Invoices_Add_Number_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une facture envoyée ou payée porte la référence du document émis.`)
};

/**
* | output |
* | --- |
* | "A sent or paid invoice carries the reference of the document that was issued." |
*
* @param {Invoices_Add_Number_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_number_required = /** @type {((inputs?: Invoices_Add_Number_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Number_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_number_required(inputs)
	return en_invoices_add_number_required(inputs)
});
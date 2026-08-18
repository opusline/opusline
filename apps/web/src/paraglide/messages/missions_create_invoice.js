/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Create_InvoiceInputs */

const en_missions_create_invoice = /** @type {(inputs: Missions_Create_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record an invoice`)
};

const fr_missions_create_invoice = /** @type {(inputs: Missions_Create_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer une facture`)
};

/**
* | output |
* | --- |
* | "Record an invoice" |
*
* @param {Missions_Create_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_create_invoice = /** @type {((inputs?: Missions_Create_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Create_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_create_invoice(inputs)
	return en_missions_create_invoice(inputs)
});
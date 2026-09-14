/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, client: NonNullable<unknown> }} Invoices_Delete_BodyInputs */

const en_invoices_delete_body = /** @type {(inputs: Invoices_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The ${i?.amount} draft for ${i?.client} will be removed; the time it covered goes back to “to invoice”.`)
};

const fr_invoices_delete_body = /** @type {(inputs: Invoices_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le brouillon de ${i?.amount} pour ${i?.client} sera supprimé ; le temps qu'il couvrait repasse « à facturer ».`)
};

/**
* | output |
* | --- |
* | "The {amount} draft for {client} will be removed; the time it covered goes back to “to invoice”." |
*
* @param {Invoices_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_body = /** @type {((inputs: Invoices_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_body(inputs)
	return en_invoices_delete_body(inputs)
});
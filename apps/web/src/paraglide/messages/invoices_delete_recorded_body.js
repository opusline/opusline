/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown>, amount: NonNullable<unknown>, client: NonNullable<unknown> }} Invoices_Delete_Recorded_BodyInputs */

const en_invoices_delete_recorded_body = /** @type {(inputs: Invoices_Delete_Recorded_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number} of ${i?.amount} for ${i?.client} will be removed from Opusline, with its filed PDF if it has one; the time it covered goes back to “to invoice”. Nothing is sent to the client.`)
};

const fr_invoices_delete_recorded_body = /** @type {(inputs: Invoices_Delete_Recorded_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`La facture ${i?.number} de ${i?.amount} pour ${i?.client} sera retirée d'Opusline, avec son PDF s'il y en a un ; le temps qu'elle couvrait repasse « à facturer ». Rien n'est envoyé au client.`)
};

/**
* | output |
* | --- |
* | "Invoice {number} of {amount} for {client} will be removed from Opusline, with its filed PDF if it has one; the time it covered goes back to “to invoice”. Not..." |
*
* @param {Invoices_Delete_Recorded_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_recorded_body = /** @type {((inputs: Invoices_Delete_Recorded_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_Recorded_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_recorded_body(inputs)
	return en_invoices_delete_recorded_body(inputs)
});
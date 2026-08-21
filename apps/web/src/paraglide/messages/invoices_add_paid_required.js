/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Paid_RequiredInputs */

const en_invoices_add_paid_required = /** @type {(inputs: Invoices_Add_Paid_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A paid invoice carries the date the money landed.`)
};

const fr_invoices_add_paid_required = /** @type {(inputs: Invoices_Add_Paid_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une facture payée porte la date à laquelle l'argent est arrivé.`)
};

/**
* | output |
* | --- |
* | "A paid invoice carries the date the money landed." |
*
* @param {Invoices_Add_Paid_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_paid_required = /** @type {((inputs?: Invoices_Add_Paid_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Paid_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_paid_required(inputs)
	return en_invoices_add_paid_required(inputs)
});
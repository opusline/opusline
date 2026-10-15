/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_No_MissionsInputs */

const en_invoices_add_no_missions = /** @type {(inputs: Invoices_Add_No_MissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a mission first: an invoice is always filed under one.`)
};

const fr_invoices_add_no_missions = /** @type {(inputs: Invoices_Add_No_MissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créez d'abord une mission : une facture est toujours rattachée à l'une d'elles.`)
};

/**
* | output |
* | --- |
* | "Create a mission first: an invoice is always filed under one." |
*
* @param {Invoices_Add_No_MissionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_no_missions = /** @type {((inputs?: Invoices_Add_No_MissionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_No_MissionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_no_missions(inputs)
	return en_invoices_add_no_missions(inputs)
});
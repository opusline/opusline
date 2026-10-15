/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_DeletedInputs */

const en_invoices_deleted = /** @type {(inputs: Invoices_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft deleted`)
};

const fr_invoices_deleted = /** @type {(inputs: Invoices_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon supprimé`)
};

/**
* | output |
* | --- |
* | "Draft deleted" |
*
* @param {Invoices_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_deleted = /** @type {((inputs?: Invoices_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_deleted(inputs)
	return en_invoices_deleted(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Delete_FailedInputs */

const en_invoices_delete_failed = /** @type {(inputs: Invoices_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The draft could not be deleted.`)
};

const fr_invoices_delete_failed = /** @type {(inputs: Invoices_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le brouillon n'a pas pu être supprimé.`)
};

/**
* | output |
* | --- |
* | "The draft could not be deleted." |
*
* @param {Invoices_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_delete_failed = /** @type {((inputs?: Invoices_Delete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Delete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_delete_failed(inputs)
	return en_invoices_delete_failed(inputs)
});
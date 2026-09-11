/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Reopen_FailedInputs */

const en_invoices_reopen_failed = /** @type {(inputs: Invoices_Reopen_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be taken back.`)
};

const fr_invoices_reopen_failed = /** @type {(inputs: Invoices_Reopen_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu revenir en arrière.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be taken back." |
*
* @param {Invoices_Reopen_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_reopen_failed = /** @type {((inputs?: Invoices_Reopen_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Reopen_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_reopen_failed(inputs)
	return en_invoices_reopen_failed(inputs)
});
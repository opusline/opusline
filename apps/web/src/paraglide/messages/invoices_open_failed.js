/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Open_FailedInputs */

const en_invoices_open_failed = /** @type {(inputs: Invoices_Open_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be opened. Try again in a moment.`)
};

const fr_invoices_open_failed = /** @type {(inputs: Invoices_Open_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être ouverte. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be opened. Try again in a moment." |
*
* @param {Invoices_Open_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_open_failed = /** @type {((inputs?: Invoices_Open_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Open_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_open_failed(inputs)
	return en_invoices_open_failed(inputs)
});
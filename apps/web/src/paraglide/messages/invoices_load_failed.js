/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Load_FailedInputs */

const en_invoices_load_failed = /** @type {(inputs: Invoices_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoices could not be loaded. Try again in a moment.`)
};

const fr_invoices_load_failed = /** @type {(inputs: Invoices_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger les factures. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The invoices could not be loaded. Try again in a moment." |
*
* @param {Invoices_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_load_failed = /** @type {((inputs?: Invoices_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_load_failed(inputs)
	return en_invoices_load_failed(inputs)
});
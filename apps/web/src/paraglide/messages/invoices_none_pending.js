/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_None_PendingInputs */

const en_invoices_none_pending = /** @type {(inputs: Invoices_None_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing pending`)
};

const fr_invoices_none_pending = /** @type {(inputs: Invoices_None_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`rien en attente`)
};

/**
* | output |
* | --- |
* | "nothing pending" |
*
* @param {Invoices_None_PendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_none_pending = /** @type {((inputs?: Invoices_None_PendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_None_PendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_none_pending(inputs)
	return en_invoices_none_pending(inputs)
});
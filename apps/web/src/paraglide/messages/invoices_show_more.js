/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Show_MoreInputs */

const en_invoices_show_more = /** @type {(inputs: Invoices_Show_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show older invoices`)
};

const fr_invoices_show_more = /** @type {(inputs: Invoices_Show_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher les factures plus anciennes`)
};

/**
* | output |
* | --- |
* | "Show older invoices" |
*
* @param {Invoices_Show_MoreInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_show_more = /** @type {((inputs?: Invoices_Show_MoreInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Show_MoreInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_show_more(inputs)
	return en_invoices_show_more(inputs)
});
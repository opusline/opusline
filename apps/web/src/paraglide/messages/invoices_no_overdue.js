/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_No_OverdueInputs */

const en_invoices_no_overdue = /** @type {(inputs: Invoices_No_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no overdue invoices`)
};

const fr_invoices_no_overdue = /** @type {(inputs: Invoices_No_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune échéance dépassée`)
};

/**
* | output |
* | --- |
* | "no overdue invoices" |
*
* @param {Invoices_No_OverdueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_no_overdue = /** @type {((inputs?: Invoices_No_OverdueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_No_OverdueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_no_overdue(inputs)
	return en_invoices_no_overdue(inputs)
});
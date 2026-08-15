/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown>, days: NonNullable<unknown> }} Invoices_Overdue_DetailInputs */

const en_invoices_overdue_detail = /** @type {(inputs: Invoices_Overdue_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Overdue since ${i?.date} · ${i?.days} d late`)
};

const fr_invoices_overdue_detail = /** @type {(inputs: Invoices_Overdue_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Échue le ${i?.date} · ${i?.days} j de retard`)
};

/**
* | output |
* | --- |
* | "Overdue since {date} · {days} d late" |
*
* @param {Invoices_Overdue_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_overdue_detail = /** @type {((inputs: Invoices_Overdue_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Overdue_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_overdue_detail(inputs)
	return en_invoices_overdue_detail(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_Pending_CountInputs */

const en_invoices_pending_count = /** @type {(inputs: Invoices_Pending_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} pending`)
};

const fr_invoices_pending_count = /** @type {(inputs: Invoices_Pending_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} en attente`)
};

/**
* | output |
* | --- |
* | "{count} pending" |
*
* @param {Invoices_Pending_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_pending_count = /** @type {((inputs: Invoices_Pending_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Pending_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_pending_count(inputs)
	return en_invoices_pending_count(inputs)
});
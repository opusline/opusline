/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Overdue_TileInputs */

const en_invoices_overdue_tile = /** @type {(inputs: Invoices_Overdue_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Of which late`)
};

const fr_invoices_overdue_tile = /** @type {(inputs: Invoices_Overdue_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dont en retard`)
};

/**
* | output |
* | --- |
* | "Of which late" |
*
* @param {Invoices_Overdue_TileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_overdue_tile = /** @type {((inputs?: Invoices_Overdue_TileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Overdue_TileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_overdue_tile(inputs)
	return en_invoices_overdue_tile(inputs)
});
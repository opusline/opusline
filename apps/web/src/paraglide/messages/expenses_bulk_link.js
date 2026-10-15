/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_LinkInputs */

const en_expenses_bulk_link = /** @type {(inputs: Expenses_Bulk_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Link a receipt`)
};

const fr_expenses_bulk_link = /** @type {(inputs: Expenses_Bulk_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lier une facture`)
};

/**
* | output |
* | --- |
* | "Link a receipt" |
*
* @param {Expenses_Bulk_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_bulk_link = /** @type {((inputs?: Expenses_Bulk_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Bulk_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_bulk_link(inputs)
	return en_expenses_bulk_link(inputs)
});
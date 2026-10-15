/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_DeferInputs */

const en_expenses_bulk_defer = /** @type {(inputs: Expenses_Bulk_DeferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defer`)
};

const fr_expenses_bulk_defer = /** @type {(inputs: Expenses_Bulk_DeferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reporter`)
};

/**
* | output |
* | --- |
* | "Defer" |
*
* @param {Expenses_Bulk_DeferInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_bulk_defer = /** @type {((inputs?: Expenses_Bulk_DeferInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Bulk_DeferInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_bulk_defer(inputs)
	return en_expenses_bulk_defer(inputs)
});
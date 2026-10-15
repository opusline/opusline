/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Col_SupplierInputs */

const en_expenses_col_supplier = /** @type {(inputs: Expenses_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier`)
};

const fr_expenses_col_supplier = /** @type {(inputs: Expenses_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fournisseur`)
};

/**
* | output |
* | --- |
* | "Supplier" |
*
* @param {Expenses_Col_SupplierInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_col_supplier = /** @type {((inputs?: Expenses_Col_SupplierInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Col_SupplierInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_col_supplier(inputs)
	return en_expenses_col_supplier(inputs)
});
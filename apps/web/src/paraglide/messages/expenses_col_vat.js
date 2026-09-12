/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Col_VatInputs */

const en_expenses_col_vat = /** @type {(inputs: Expenses_Col_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

const fr_expenses_col_vat = /** @type {(inputs: Expenses_Col_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA`)
};

/**
* | output |
* | --- |
* | "TVA" |
*
* @param {Expenses_Col_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_col_vat = /** @type {((inputs?: Expenses_Col_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Col_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_col_vat(inputs)
	return en_expenses_col_vat(inputs)
});
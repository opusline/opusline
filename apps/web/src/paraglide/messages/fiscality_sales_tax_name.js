/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Sales_Tax_NameInputs */

const en_fiscality_sales_tax_name = /** @type {(inputs: Fiscality_Sales_Tax_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales tax`)
};

const fr_fiscality_sales_tax_name = /** @type {(inputs: Fiscality_Sales_Tax_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taxe sur les ventes`)
};

/**
* | output |
* | --- |
* | "Sales tax" |
*
* @param {Fiscality_Sales_Tax_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_sales_tax_name = /** @type {((inputs?: Fiscality_Sales_Tax_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Sales_Tax_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_fiscality_sales_tax_name(inputs)
	return en_fiscality_sales_tax_name(inputs)
});
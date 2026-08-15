/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Sales_Tax_Zero_HintInputs */

const en_fiscality_sales_tax_zero_hint = /** @type {(inputs: Fiscality_Sales_Tax_Zero_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set 0 if you do not charge tax.`)
};

const fr_fiscality_sales_tax_zero_hint = /** @type {(inputs: Fiscality_Sales_Tax_Zero_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettez 0 si vous ne facturez pas de taxe.`)
};

/**
* | output |
* | --- |
* | "Set 0 if you do not charge tax." |
*
* @param {Fiscality_Sales_Tax_Zero_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_sales_tax_zero_hint = /** @type {((inputs?: Fiscality_Sales_Tax_Zero_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Sales_Tax_Zero_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_fiscality_sales_tax_zero_hint(inputs)
	return en_fiscality_sales_tax_zero_hint(inputs)
});
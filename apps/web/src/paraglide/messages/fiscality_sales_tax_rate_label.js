/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Fiscality_Sales_Tax_Rate_LabelInputs */



/**
* | output |
* | --- |
* | "Default tax rate" |
*
* @param {Fiscality_Sales_Tax_Rate_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const fiscality_sales_tax_rate_label = /** @type {((inputs?: Fiscality_Sales_Tax_Rate_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fiscality_Sales_Tax_Rate_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Taux de taxe par défaut")
	return /** @type {LocalizedString} */ ("Default tax rate")
});
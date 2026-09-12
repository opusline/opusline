/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Box_LeadInputs */

const en_declarations_income_tax_box_lead = /** @type {(inputs: Declarations_Income_Tax_Box_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Goes in`)
};

const fr_declarations_income_tax_box_lead = /** @type {(inputs: Declarations_Income_Tax_Box_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À reporter`)
};

/**
* | output |
* | --- |
* | "Goes in" |
*
* @param {Declarations_Income_Tax_Box_LeadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_box_lead = /** @type {((inputs?: Declarations_Income_Tax_Box_LeadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Box_LeadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_box_lead(inputs)
	return en_declarations_income_tax_box_lead(inputs)
});
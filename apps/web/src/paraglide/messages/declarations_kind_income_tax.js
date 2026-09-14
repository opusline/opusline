/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Kind_Income_TaxInputs */

const en_declarations_kind_income_tax = /** @type {(inputs: Declarations_Kind_Income_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`2042-C PRO`)
};

const fr_declarations_kind_income_tax = /** @type {(inputs: Declarations_Kind_Income_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`2042-C PRO`)
};

/**
* | output |
* | --- |
* | "2042-C PRO" |
*
* @param {Declarations_Kind_Income_TaxInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_kind_income_tax = /** @type {((inputs?: Declarations_Kind_Income_TaxInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Kind_Income_TaxInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_kind_income_tax(inputs)
	return en_declarations_kind_income_tax(inputs)
});
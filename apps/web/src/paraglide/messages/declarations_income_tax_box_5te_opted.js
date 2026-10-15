/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Box_5te_OptedInputs */

const en_declarations_income_tax_box_5te_opted = /** @type {(inputs: Declarations_Income_Tax_Box_5te_OptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`box 5TE · versement libératoire opted`)
};

const fr_declarations_income_tax_box_5te_opted = /** @type {(inputs: Declarations_Income_Tax_Box_5te_OptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`case 5TE · versement libératoire opté`)
};

/**
* | output |
* | --- |
* | "box 5TE · versement libératoire opted" |
*
* @param {Declarations_Income_Tax_Box_5te_OptedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_box_5te_opted = /** @type {((inputs?: Declarations_Income_Tax_Box_5te_OptedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Box_5te_OptedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_box_5te_opted(inputs)
	return en_declarations_income_tax_box_5te_opted(inputs)
});
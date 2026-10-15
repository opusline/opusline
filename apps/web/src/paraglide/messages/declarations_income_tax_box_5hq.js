/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Box_5hqInputs */

const en_declarations_income_tax_box_5hq = /** @type {(inputs: Declarations_Income_Tax_Box_5hqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`box 5HQ`)
};

const fr_declarations_income_tax_box_5hq = /** @type {(inputs: Declarations_Income_Tax_Box_5hqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`case 5HQ`)
};

/**
* | output |
* | --- |
* | "box 5HQ" |
*
* @param {Declarations_Income_Tax_Box_5hqInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_box_5hq = /** @type {((inputs?: Declarations_Income_Tax_Box_5hqInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Box_5hqInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_box_5hq(inputs)
	return en_declarations_income_tax_box_5hq(inputs)
});
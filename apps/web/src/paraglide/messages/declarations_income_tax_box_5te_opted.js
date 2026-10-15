/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Box_5te_OptedInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("case 5TE · versement libératoire opté")
	return /** @type {LocalizedString} */ ("box 5TE · versement libératoire opted")
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_ProvisionalInputs */



/**
* | output |
* | --- |
* | "provisional until 31 Dec." |
*
* @param {Declarations_Income_Tax_ProvisionalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_provisional = /** @type {((inputs?: Declarations_Income_Tax_ProvisionalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_ProvisionalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("provisoire jusqu'au 31 déc.")
	return /** @type {LocalizedString} */ ("provisional until 31 Dec.")
});
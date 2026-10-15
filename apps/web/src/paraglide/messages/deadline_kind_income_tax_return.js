/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Kind_Income_Tax_ReturnInputs */



/**
* | output |
* | --- |
* | "Déclaration de revenus — 2042-C PRO" |
*
* @param {Deadline_Kind_Income_Tax_ReturnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_kind_income_tax_return = /** @type {((inputs?: Deadline_Kind_Income_Tax_ReturnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Kind_Income_Tax_ReturnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Déclaration de revenus — 2042-C PRO")
	return /** @type {LocalizedString} */ ("Déclaration de revenus — 2042-C PRO")
});
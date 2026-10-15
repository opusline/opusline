/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Month_UnbilledInputs */



/**
* | output |
* | --- |
* | "tracked this month, not yet invoiced." |
*
* @param {Invoices_Month_UnbilledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_month_unbilled = /** @type {((inputs?: Invoices_Month_UnbilledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Month_UnbilledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("saisis ce mois-ci, pas encore facturés.")
	return /** @type {LocalizedString} */ ("tracked this month, not yet invoiced.")
});
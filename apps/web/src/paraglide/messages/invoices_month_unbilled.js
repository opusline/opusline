/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Month_UnbilledInputs */

const en_invoices_month_unbilled = /** @type {(inputs: Invoices_Month_UnbilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`tracked this month, not yet invoiced.`)
};

const fr_invoices_month_unbilled = /** @type {(inputs: Invoices_Month_UnbilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`saisis ce mois-ci, pas encore facturés.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_month_unbilled(inputs)
	return en_invoices_month_unbilled(inputs)
});
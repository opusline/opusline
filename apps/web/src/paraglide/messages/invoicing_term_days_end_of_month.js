/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Invoicing_Term_Days_End_Of_MonthInputs */

const en_invoicing_term_days_end_of_month = /** @type {(inputs: Invoicing_Term_Days_End_Of_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} days end of month`)
};

const fr_invoicing_term_days_end_of_month = /** @type {(inputs: Invoicing_Term_Days_End_Of_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} jours fin de mois`)
};

/**
* | output |
* | --- |
* | "{days} days end of month" |
*
* @param {Invoicing_Term_Days_End_Of_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_term_days_end_of_month = /** @type {((inputs: Invoicing_Term_Days_End_Of_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Term_Days_End_Of_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_term_days_end_of_month(inputs)
	return en_invoicing_term_days_end_of_month(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Invoices_Average_Days_To_PayInputs */

const en_invoices_average_days_to_pay = /** @type {(inputs: Invoices_Average_Days_To_PayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d average to pay`)
};

const fr_invoices_average_days_to_pay = /** @type {(inputs: Invoices_Average_Days_To_PayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} j en moyenne pour payer`)
};

/**
* | output |
* | --- |
* | "{days} d average to pay" |
*
* @param {Invoices_Average_Days_To_PayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_average_days_to_pay = /** @type {((inputs: Invoices_Average_Days_To_PayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Average_Days_To_PayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_average_days_to_pay(inputs)
	return en_invoices_average_days_to_pay(inputs)
});
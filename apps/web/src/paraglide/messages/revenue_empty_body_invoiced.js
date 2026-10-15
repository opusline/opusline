/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Empty_Body_InvoicedInputs */

const en_revenue_empty_body_invoiced = /** @type {(inputs: Revenue_Empty_Body_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoice was issued over this period.`)
};

const fr_revenue_empty_body_invoiced = /** @type {(inputs: Revenue_Empty_Body_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune facture n'a été émise sur cette période.`)
};

/**
* | output |
* | --- |
* | "No invoice was issued over this period." |
*
* @param {Revenue_Empty_Body_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_body_invoiced = /** @type {((inputs?: Revenue_Empty_Body_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_Body_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_empty_body_invoiced(inputs)
	return en_revenue_empty_body_invoiced(inputs)
});
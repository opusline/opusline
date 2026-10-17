/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Amount_InvalidInputs */

const en_invoices_amount_invalid = /** @type {(inputs: Invoices_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an amount between zero and what is still due.`)
};

const fr_invoices_amount_invalid = /** @type {(inputs: Invoices_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez un montant compris entre zéro et le reste à payer.`)
};

/**
* | output |
* | --- |
* | "Enter an amount between zero and what is still due." |
*
* @param {Invoices_Amount_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_amount_invalid = /** @type {((inputs?: Invoices_Amount_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Amount_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_amount_invalid(inputs)
	return en_invoices_amount_invalid(inputs)
});
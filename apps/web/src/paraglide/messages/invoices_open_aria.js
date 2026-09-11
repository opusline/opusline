/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Invoices_Open_AriaInputs */

const en_invoices_open_aria = /** @type {(inputs: Invoices_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open the invoice ${i?.label}`)
};

const fr_invoices_open_aria = /** @type {(inputs: Invoices_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ouvrir la facture ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Open the invoice {label}" |
*
* @param {Invoices_Open_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_open_aria = /** @type {((inputs: Invoices_Open_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Open_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_open_aria(inputs)
	return en_invoices_open_aria(inputs)
});
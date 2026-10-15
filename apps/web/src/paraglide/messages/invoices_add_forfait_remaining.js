/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Forfait_RemainingInputs */

const en_invoices_add_forfait_remaining = /** @type {(inputs: Invoices_Add_Forfait_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Left to invoice`)
};

const fr_invoices_add_forfait_remaining = /** @type {(inputs: Invoices_Add_Forfait_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reste à facturer`)
};

/**
* | output |
* | --- |
* | "Left to invoice" |
*
* @param {Invoices_Add_Forfait_RemainingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_forfait_remaining = /** @type {((inputs?: Invoices_Add_Forfait_RemainingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Forfait_RemainingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_forfait_remaining(inputs)
	return en_invoices_add_forfait_remaining(inputs)
});
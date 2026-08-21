/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Forfait_AmountInputs */

const en_invoices_add_forfait_amount = /** @type {(inputs: Invoices_Add_Forfait_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed price`)
};

const fr_invoices_add_forfait_amount = /** @type {(inputs: Invoices_Add_Forfait_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait`)
};

/**
* | output |
* | --- |
* | "Fixed price" |
*
* @param {Invoices_Add_Forfait_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_forfait_amount = /** @type {((inputs?: Invoices_Add_Forfait_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Forfait_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_forfait_amount(inputs)
	return en_invoices_add_forfait_amount(inputs)
});
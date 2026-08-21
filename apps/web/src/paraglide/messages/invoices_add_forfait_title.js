/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Forfait_TitleInputs */

const en_invoices_add_forfait_title = /** @type {(inputs: Invoices_Add_Forfait_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed-price mission`)
};

const fr_invoices_add_forfait_title = /** @type {(inputs: Invoices_Add_Forfait_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission au forfait`)
};

/**
* | output |
* | --- |
* | "Fixed-price mission" |
*
* @param {Invoices_Add_Forfait_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_forfait_title = /** @type {((inputs?: Invoices_Add_Forfait_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Forfait_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_forfait_title(inputs)
	return en_invoices_add_forfait_title(inputs)
});
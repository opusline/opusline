/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Correct_Dates_TitleInputs */

const en_invoices_correct_dates_title = /** @type {(inputs: Invoices_Correct_Dates_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Correct the dates`)
};

const fr_invoices_correct_dates_title = /** @type {(inputs: Invoices_Correct_Dates_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corriger les dates`)
};

/**
* | output |
* | --- |
* | "Correct the dates" |
*
* @param {Invoices_Correct_Dates_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_correct_dates_title = /** @type {((inputs?: Invoices_Correct_Dates_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Correct_Dates_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_correct_dates_title(inputs)
	return en_invoices_correct_dates_title(inputs)
});
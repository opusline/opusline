/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Correct_Dates_SaveInputs */

const en_invoices_correct_dates_save = /** @type {(inputs: Invoices_Correct_Dates_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the dates`)
};

const fr_invoices_correct_dates_save = /** @type {(inputs: Invoices_Correct_Dates_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer les dates`)
};

/**
* | output |
* | --- |
* | "Save the dates" |
*
* @param {Invoices_Correct_Dates_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_correct_dates_save = /** @type {((inputs?: Invoices_Correct_Dates_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Correct_Dates_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_correct_dates_save(inputs)
	return en_invoices_correct_dates_save(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Correct_Dates_FailedInputs */

const en_invoices_correct_dates_failed = /** @type {(inputs: Invoices_Correct_Dates_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The dates could not be corrected.`)
};

const fr_invoices_correct_dates_failed = /** @type {(inputs: Invoices_Correct_Dates_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les dates n'ont pas pu être corrigées.`)
};

/**
* | output |
* | --- |
* | "The dates could not be corrected." |
*
* @param {Invoices_Correct_Dates_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_correct_dates_failed = /** @type {((inputs?: Invoices_Correct_Dates_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Correct_Dates_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_correct_dates_failed(inputs)
	return en_invoices_correct_dates_failed(inputs)
});
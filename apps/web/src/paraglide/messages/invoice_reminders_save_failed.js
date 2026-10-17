/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Reminders_Save_FailedInputs */

const en_invoice_reminders_save_failed = /** @type {(inputs: Invoice_Reminders_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The reminder settings could not be saved.`)
};

const fr_invoice_reminders_save_failed = /** @type {(inputs: Invoice_Reminders_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les réglages de relance n'ont pas pu être enregistrés.`)
};

/**
* | output |
* | --- |
* | "The reminder settings could not be saved." |
*
* @param {Invoice_Reminders_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_save_failed = /** @type {((inputs?: Invoice_Reminders_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_save_failed(inputs)
	return en_invoice_reminders_save_failed(inputs)
});
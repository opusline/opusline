/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Note_ReminderInputs */

const en_invoices_note_reminder = /** @type {(inputs: Invoices_Note_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note a reminder`)
};

const fr_invoices_note_reminder = /** @type {(inputs: Invoices_Note_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Noter une relance`)
};

/**
* | output |
* | --- |
* | "Note a reminder" |
*
* @param {Invoices_Note_ReminderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_note_reminder = /** @type {((inputs?: Invoices_Note_ReminderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Note_ReminderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_note_reminder(inputs)
	return en_invoices_note_reminder(inputs)
});
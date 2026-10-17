/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Reminders_ToggleInputs */

const en_invoice_reminders_toggle = /** @type {(inputs: Invoice_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remind the client once past due`)
};

const fr_invoice_reminders_toggle = /** @type {(inputs: Invoice_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relancer le client après l'échéance`)
};

/**
* | output |
* | --- |
* | "Remind the client once past due" |
*
* @param {Invoice_Reminders_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_toggle = /** @type {((inputs?: Invoice_Reminders_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_toggle(inputs)
	return en_invoice_reminders_toggle(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Reminders_TitleInputs */

const en_invoice_reminders_title = /** @type {(inputs: Invoice_Reminders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Automatic reminders`)
};

const fr_invoice_reminders_title = /** @type {(inputs: Invoice_Reminders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relances automatiques`)
};

/**
* | output |
* | --- |
* | "Automatic reminders" |
*
* @param {Invoice_Reminders_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminders_title = /** @type {((inputs?: Invoice_Reminders_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminders_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminders_title(inputs)
	return en_invoice_reminders_title(inputs)
});
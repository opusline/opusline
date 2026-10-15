/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Invoice_Number_NextInputs */

const en_settings_invoice_number_next = /** @type {(inputs: Settings_Invoice_Number_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next:`)
};

const fr_settings_invoice_number_next = /** @type {(inputs: Settings_Invoice_Number_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prochaine :`)
};

/**
* | output |
* | --- |
* | "Next:" |
*
* @param {Settings_Invoice_Number_NextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_invoice_number_next = /** @type {((inputs?: Settings_Invoice_Number_NextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Invoice_Number_NextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_invoice_number_next(inputs)
	return en_settings_invoice_number_next(inputs)
});
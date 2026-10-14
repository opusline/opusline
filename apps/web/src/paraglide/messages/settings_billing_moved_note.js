/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Billing_Moved_NoteInputs */

const en_settings_billing_moved_note = /** @type {(inputs: Settings_Billing_Moved_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment terms, penalties and the mentions printed on invoices are set in`)
};

const fr_settings_billing_moved_note = /** @type {(inputs: Settings_Billing_Moved_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les conditions de paiement, les pénalités et les mentions des factures se règlent dans`)
};

/**
* | output |
* | --- |
* | "Payment terms, penalties and the mentions printed on invoices are set in" |
*
* @param {Settings_Billing_Moved_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_billing_moved_note = /** @type {((inputs?: Settings_Billing_Moved_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Billing_Moved_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_billing_moved_note(inputs)
	return en_settings_billing_moved_note(inputs)
});
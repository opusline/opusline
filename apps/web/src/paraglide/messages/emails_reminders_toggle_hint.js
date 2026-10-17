/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Reminders_Toggle_HintInputs */

const en_emails_reminders_toggle_hint = /** @type {(inputs: Emails_Reminders_Toggle_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adjustable invoice by invoice, when it is sent.`)
};

const fr_emails_reminders_toggle_hint = /** @type {(inputs: Emails_Reminders_Toggle_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifiable facture par facture, au moment de l'envoi.`)
};

/**
* | output |
* | --- |
* | "Adjustable invoice by invoice, when it is sent." |
*
* @param {Emails_Reminders_Toggle_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reminders_toggle_hint = /** @type {((inputs?: Emails_Reminders_Toggle_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Reminders_Toggle_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reminders_toggle_hint(inputs)
	return en_emails_reminders_toggle_hint(inputs)
});
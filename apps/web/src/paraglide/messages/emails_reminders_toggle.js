/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Reminders_ToggleInputs */

const en_emails_reminders_toggle = /** @type {(inputs: Emails_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn reminders on for every new invoice`)
};

const fr_emails_reminders_toggle = /** @type {(inputs: Emails_Reminders_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer les relances sur chaque nouvelle facture`)
};

/**
* | output |
* | --- |
* | "Turn reminders on for every new invoice" |
*
* @param {Emails_Reminders_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reminders_toggle = /** @type {((inputs?: Emails_Reminders_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Reminders_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reminders_toggle(inputs)
	return en_emails_reminders_toggle(inputs)
});
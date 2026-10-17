/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Reminders_Save_FailedInputs */

const en_emails_reminders_save_failed = /** @type {(inputs: Emails_Reminders_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The reminder defaults could not be saved.`)
};

const fr_emails_reminders_save_failed = /** @type {(inputs: Emails_Reminders_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les réglages de relance n'ont pas pu être enregistrés.`)
};

/**
* | output |
* | --- |
* | "The reminder defaults could not be saved." |
*
* @param {Emails_Reminders_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_reminders_save_failed = /** @type {((inputs?: Emails_Reminders_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Reminders_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_reminders_save_failed(inputs)
	return en_emails_reminders_save_failed(inputs)
});
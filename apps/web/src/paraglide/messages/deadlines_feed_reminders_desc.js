/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Reminders_DescInputs */



/**
* | output |
* | --- |
* | "A nudge three days after an unpaid invoice's due date." |
*
* @param {Deadlines_Feed_Reminders_DescInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_feed_reminders_desc = /** @type {((inputs?: Deadlines_Feed_Reminders_DescInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Feed_Reminders_DescInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Un rappel trois jours après l'échéance d'une facture non réglée.")
	return /** @type {LocalizedString} */ ("A nudge three days after an unpaid invoice's due date.")
});
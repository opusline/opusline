/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Feed_Reminders_DescInputs */

const en_deadlines_feed_reminders_desc = /** @type {(inputs: Deadlines_Feed_Reminders_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A nudge three days after an unpaid invoice's due date.`)
};

const fr_deadlines_feed_reminders_desc = /** @type {(inputs: Deadlines_Feed_Reminders_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un rappel trois jours après l'échéance d'une facture non réglée.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_feed_reminders_desc(inputs)
	return en_deadlines_feed_reminders_desc(inputs)
});
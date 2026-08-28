/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Reminder_Never_SentInputs */

const en_deadlines_reminder_never_sent = /** @type {(inputs: Deadlines_Reminder_Never_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no reminder sent yet`)
};

const fr_deadlines_reminder_never_sent = /** @type {(inputs: Deadlines_Reminder_Never_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune relance envoyée`)
};

/**
* | output |
* | --- |
* | "no reminder sent yet" |
*
* @param {Deadlines_Reminder_Never_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminder_never_sent = /** @type {((inputs?: Deadlines_Reminder_Never_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminder_Never_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_reminder_never_sent(inputs)
	return en_deadlines_reminder_never_sent(inputs)
});
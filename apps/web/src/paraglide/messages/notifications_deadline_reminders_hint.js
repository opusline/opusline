/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Notifications_Deadline_Reminders_HintInputs */

const en_notifications_deadline_reminders_hint = /** @type {(inputs: Notifications_Deadline_Reminders_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One morning email a week before, the day before and on the day a tax deadline or an unpaid invoice falls due.`)
};

const fr_notifications_deadline_reminders_hint = /** @type {(inputs: Notifications_Deadline_Reminders_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un e-mail le matin, une semaine avant, la veille et le jour même d'une échéance fiscale ou d'une facture impayée.`)
};

/**
* | output |
* | --- |
* | "One morning email a week before, the day before and on the day a tax deadline or an unpaid invoice falls due." |
*
* @param {Notifications_Deadline_Reminders_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const notifications_deadline_reminders_hint = /** @type {((inputs?: Notifications_Deadline_Reminders_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Notifications_Deadline_Reminders_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_notifications_deadline_reminders_hint(inputs)
	return en_notifications_deadline_reminders_hint(inputs)
});
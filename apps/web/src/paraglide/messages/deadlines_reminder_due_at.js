/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Deadlines_Reminder_Due_AtInputs */

const en_deadlines_reminder_due_at = /** @type {(inputs: Deadlines_Reminder_Due_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`due on ${i?.date}`)
};

const fr_deadlines_reminder_due_at = /** @type {(inputs: Deadlines_Reminder_Due_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`échéance au ${i?.date}`)
};

/**
* | output |
* | --- |
* | "due on {date}" |
*
* @param {Deadlines_Reminder_Due_AtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminder_due_at = /** @type {((inputs: Deadlines_Reminder_Due_AtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminder_Due_AtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_reminder_due_at(inputs)
	return en_deadlines_reminder_due_at(inputs)
});
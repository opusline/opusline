/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Deadlines_Reminder_TitleInputs */

const en_deadlines_reminder_title = /** @type {(inputs: Deadlines_Reminder_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remind ${i?.client}`)
};

const fr_deadlines_reminder_title = /** @type {(inputs: Deadlines_Reminder_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Relancer ${i?.client}`)
};

/**
* | output |
* | --- |
* | "Remind {client}" |
*
* @param {Deadlines_Reminder_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_reminder_title = /** @type {((inputs: Deadlines_Reminder_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Reminder_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_reminder_title(inputs)
	return en_deadlines_reminder_title(inputs)
});
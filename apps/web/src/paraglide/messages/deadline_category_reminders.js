/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadline_Category_RemindersInputs */

const en_deadline_category_reminders = /** @type {(inputs: Deadline_Category_RemindersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders`)
};

const fr_deadline_category_reminders = /** @type {(inputs: Deadline_Category_RemindersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relances`)
};

/**
* | output |
* | --- |
* | "Reminders" |
*
* @param {Deadline_Category_RemindersInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadline_category_reminders = /** @type {((inputs?: Deadline_Category_RemindersInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadline_Category_RemindersInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadline_category_reminders(inputs)
	return en_deadline_category_reminders(inputs)
});
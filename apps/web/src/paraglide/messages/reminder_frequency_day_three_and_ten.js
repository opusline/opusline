/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Reminder_Frequency_Day_Three_And_TenInputs */

const en_reminder_frequency_day_three_and_ten = /** @type {(inputs: Reminder_Frequency_Day_Three_And_TenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On day 3, then on day 10`)
};

const fr_reminder_frequency_day_three_and_ten = /** @type {(inputs: Reminder_Frequency_Day_Three_And_TenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À J+3 puis à J+10`)
};

/**
* | output |
* | --- |
* | "On day 3, then on day 10" |
*
* @param {Reminder_Frequency_Day_Three_And_TenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const reminder_frequency_day_three_and_ten = /** @type {((inputs?: Reminder_Frequency_Day_Three_And_TenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Reminder_Frequency_Day_Three_And_TenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_reminder_frequency_day_three_and_ten(inputs)
	return en_reminder_frequency_day_three_and_ten(inputs)
});
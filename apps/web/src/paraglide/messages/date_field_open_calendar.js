/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Date_Field_Open_CalendarInputs */

const en_date_field_open_calendar = /** @type {(inputs: Date_Field_Open_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the calendar`)
};

const fr_date_field_open_calendar = /** @type {(inputs: Date_Field_Open_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir le calendrier`)
};

/**
* | output |
* | --- |
* | "Open the calendar" |
*
* @param {Date_Field_Open_CalendarInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const date_field_open_calendar = /** @type {((inputs?: Date_Field_Open_CalendarInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Field_Open_CalendarInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_date_field_open_calendar(inputs)
	return en_date_field_open_calendar(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Day_Picker_LabelInputs */

const en_week_day_picker_label = /** @type {(inputs: Week_Day_Picker_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day of the week`)
};

const fr_week_day_picker_label = /** @type {(inputs: Week_Day_Picker_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jour de la semaine`)
};

/**
* | output |
* | --- |
* | "Day of the week" |
*
* @param {Week_Day_Picker_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_day_picker_label = /** @type {((inputs?: Week_Day_Picker_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Day_Picker_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_day_picker_label(inputs)
	return en_week_day_picker_label(inputs)
});
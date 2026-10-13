/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Day_EmptyInputs */

const en_week_day_empty = /** @type {(inputs: Week_Day_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No entries this day`)
};

const fr_week_day_empty = /** @type {(inputs: Week_Day_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune entrée ce jour`)
};

/**
* | output |
* | --- |
* | "No entries this day" |
*
* @param {Week_Day_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_day_empty = /** @type {((inputs?: Week_Day_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Day_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_day_empty(inputs)
	return en_week_day_empty(inputs)
});
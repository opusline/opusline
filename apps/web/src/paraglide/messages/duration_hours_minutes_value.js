/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown>, minutes: NonNullable<unknown> }} Duration_Hours_Minutes_ValueInputs */

const en_duration_hours_minutes_value = /** @type {(inputs: Duration_Hours_Minutes_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours} h ${i?.minutes}`)
};

const fr_duration_hours_minutes_value = /** @type {(inputs: Duration_Hours_Minutes_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours} h ${i?.minutes}`)
};

/**
* | output |
* | --- |
* | "{hours} h {minutes}" |
*
* @param {Duration_Hours_Minutes_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const duration_hours_minutes_value = /** @type {((inputs: Duration_Hours_Minutes_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Duration_Hours_Minutes_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_duration_hours_minutes_value(inputs)
	return en_duration_hours_minutes_value(inputs)
});
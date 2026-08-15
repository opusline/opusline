/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Duration_Hours_ValueInputs */

const en_duration_hours_value = /** @type {(inputs: Duration_Hours_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} h`)
};

const fr_duration_hours_value = /** @type {(inputs: Duration_Hours_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} h`)
};

/**
* | output |
* | --- |
* | "{value} h" |
*
* @param {Duration_Hours_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const duration_hours_value = /** @type {((inputs: Duration_Hours_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Duration_Hours_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_duration_hours_value(inputs)
	return en_duration_hours_value(inputs)
});
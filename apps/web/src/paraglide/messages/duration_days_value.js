/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Duration_Days_ValueInputs */

const en_duration_days_value = /** @type {(inputs: Duration_Days_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} d`)
};

const fr_duration_days_value = /** @type {(inputs: Duration_Days_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} j`)
};

/**
* | output |
* | --- |
* | "{value} d" |
*
* @param {Duration_Days_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const duration_days_value = /** @type {((inputs: Duration_Days_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Duration_Days_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_duration_days_value(inputs)
	return en_duration_days_value(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_In_DaysInputs */

const en_deadlines_in_days = /** @type {(inputs: Deadlines_In_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`in ${i?.count} days`)
};

const fr_deadlines_in_days = /** @type {(inputs: Deadlines_In_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`dans ${i?.count} jours`)
};

/**
* | output |
* | --- |
* | "in {count} days" |
*
* @param {Deadlines_In_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_in_days = /** @type {((inputs: Deadlines_In_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_In_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_in_days(inputs)
	return en_deadlines_in_days(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ day: NonNullable<unknown> }} Subscriptions_Debit_DayInputs */

const en_subscriptions_debit_day = /** @type {(inputs: Subscriptions_Debit_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on day ${i?.day}`)
};

const fr_subscriptions_debit_day = /** @type {(inputs: Subscriptions_Debit_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`le ${i?.day}`)
};

/**
* | output |
* | --- |
* | "on day {day}" |
*
* @param {Subscriptions_Debit_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_debit_day = /** @type {((inputs: Subscriptions_Debit_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Debit_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_debit_day(inputs)
	return en_subscriptions_debit_day(inputs)
});
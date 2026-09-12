/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ day: NonNullable<unknown>, month: NonNullable<unknown> }} Subscriptions_Debit_Day_MonthInputs */

const en_subscriptions_debit_day_month = /** @type {(inputs: Subscriptions_Debit_Day_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on ${i?.day} ${i?.month}`)
};

const fr_subscriptions_debit_day_month = /** @type {(inputs: Subscriptions_Debit_Day_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`le ${i?.day} ${i?.month}`)
};

/**
* | output |
* | --- |
* | "on {day} {month}" |
*
* @param {Subscriptions_Debit_Day_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_debit_day_month = /** @type {((inputs: Subscriptions_Debit_Day_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Debit_Day_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_debit_day_month(inputs)
	return en_subscriptions_debit_day_month(inputs)
});
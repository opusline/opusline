/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Billing_Rate_DailyInputs */

const en_billing_rate_daily = /** @type {(inputs: Billing_Rate_DailyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / d`)
};

const fr_billing_rate_daily = /** @type {(inputs: Billing_Rate_DailyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount}/j`)
};

/**
* | output |
* | --- |
* | "{amount} / d" |
*
* @param {Billing_Rate_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const billing_rate_daily = /** @type {((inputs: Billing_Rate_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Billing_Rate_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_billing_rate_daily(inputs)
	return en_billing_rate_daily(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Billing_Rate_HourlyInputs */

const en_billing_rate_hourly = /** @type {(inputs: Billing_Rate_HourlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / h`)
};

const fr_billing_rate_hourly = /** @type {(inputs: Billing_Rate_HourlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount}/h`)
};

/**
* | output |
* | --- |
* | "{amount} / h" |
*
* @param {Billing_Rate_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const billing_rate_hourly = /** @type {((inputs: Billing_Rate_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Billing_Rate_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_billing_rate_hourly(inputs)
	return en_billing_rate_hourly(inputs)
});
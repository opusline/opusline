/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Billing_Rate_FixedInputs */

const en_billing_rate_fixed = /** @type {(inputs: Billing_Rate_FixedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} fixed price`)
};

const fr_billing_rate_fixed = /** @type {(inputs: Billing_Rate_FixedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} forfait`)
};

/**
* | output |
* | --- |
* | "{amount} fixed price" |
*
* @param {Billing_Rate_FixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const billing_rate_fixed = /** @type {((inputs: Billing_Rate_FixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Billing_Rate_FixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_billing_rate_fixed(inputs)
	return en_billing_rate_fixed(inputs)
});
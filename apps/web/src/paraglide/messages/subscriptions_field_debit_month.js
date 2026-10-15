/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_Debit_MonthInputs */

const en_subscriptions_field_debit_month = /** @type {(inputs: Subscriptions_Field_Debit_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Debit month`)
};

const fr_subscriptions_field_debit_month = /** @type {(inputs: Subscriptions_Field_Debit_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mois du prélèvement`)
};

/**
* | output |
* | --- |
* | "Debit month" |
*
* @param {Subscriptions_Field_Debit_MonthInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_debit_month = /** @type {((inputs?: Subscriptions_Field_Debit_MonthInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_Debit_MonthInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_debit_month(inputs)
	return en_subscriptions_field_debit_month(inputs)
});
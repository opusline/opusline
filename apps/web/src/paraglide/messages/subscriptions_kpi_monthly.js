/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_MonthlyInputs */

const en_subscriptions_kpi_monthly = /** @type {(inputs: Subscriptions_Kpi_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly`)
};

const fr_subscriptions_kpi_monthly = /** @type {(inputs: Subscriptions_Kpi_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mensuel`)
};

/**
* | output |
* | --- |
* | "Monthly" |
*
* @param {Subscriptions_Kpi_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_monthly = /** @type {((inputs?: Subscriptions_Kpi_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_monthly(inputs)
	return en_subscriptions_kpi_monthly(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Kpi_Subscriptions_NoneInputs */

const en_expenses_kpi_subscriptions_none = /** @type {(inputs: Expenses_Kpi_Subscriptions_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no subscription yet`)
};

const fr_expenses_kpi_subscriptions_none = /** @type {(inputs: Expenses_Kpi_Subscriptions_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucun abonnement pour l'instant`)
};

/**
* | output |
* | --- |
* | "no subscription yet" |
*
* @param {Expenses_Kpi_Subscriptions_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_kpi_subscriptions_none = /** @type {((inputs?: Expenses_Kpi_Subscriptions_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Kpi_Subscriptions_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_kpi_subscriptions_none(inputs)
	return en_expenses_kpi_subscriptions_none(inputs)
});
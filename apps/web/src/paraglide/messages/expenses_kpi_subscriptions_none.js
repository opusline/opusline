/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Kpi_Subscriptions_NoneInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("aucun abonnement pour l'instant")
	return /** @type {LocalizedString} */ ("no subscription yet")
});
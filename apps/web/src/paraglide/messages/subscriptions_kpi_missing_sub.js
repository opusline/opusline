/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_Missing_SubInputs */

const en_subscriptions_kpi_missing_sub = /** @type {(inputs: Subscriptions_Kpi_Missing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`over the last 12 months`)
};

const fr_subscriptions_kpi_missing_sub = /** @type {(inputs: Subscriptions_Kpi_Missing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`sur les 12 derniers mois`)
};

/**
* | output |
* | --- |
* | "over the last 12 months" |
*
* @param {Subscriptions_Kpi_Missing_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_missing_sub = /** @type {((inputs?: Subscriptions_Kpi_Missing_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_Missing_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_missing_sub(inputs)
	return en_subscriptions_kpi_missing_sub(inputs)
});
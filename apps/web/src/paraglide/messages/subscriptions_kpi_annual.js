/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_AnnualInputs */

const en_subscriptions_kpi_annual = /** @type {(inputs: Subscriptions_Kpi_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yearly`)
};

const fr_subscriptions_kpi_annual = /** @type {(inputs: Subscriptions_Kpi_AnnualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuel`)
};

/**
* | output |
* | --- |
* | "Yearly" |
*
* @param {Subscriptions_Kpi_AnnualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_annual = /** @type {((inputs?: Subscriptions_Kpi_AnnualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_AnnualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_annual(inputs)
	return en_subscriptions_kpi_annual(inputs)
});
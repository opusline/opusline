/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_MissingInputs */

const en_subscriptions_kpi_missing = /** @type {(inputs: Subscriptions_Kpi_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missing receipts`)
};

const fr_subscriptions_kpi_missing = /** @type {(inputs: Subscriptions_Kpi_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures manquantes`)
};

/**
* | output |
* | --- |
* | "Missing receipts" |
*
* @param {Subscriptions_Kpi_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_missing = /** @type {((inputs?: Subscriptions_Kpi_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_missing(inputs)
	return en_subscriptions_kpi_missing(inputs)
});
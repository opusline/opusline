/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Forecast_Bucket_FirstInputs */

const en_invoices_forecast_bucket_first = /** @type {(inputs: Invoices_Forecast_Bucket_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 – 30 d`)
};

const fr_invoices_forecast_bucket_first = /** @type {(inputs: Invoices_Forecast_Bucket_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 – 30 j`)
};

/**
* | output |
* | --- |
* | "0 – 30 d" |
*
* @param {Invoices_Forecast_Bucket_FirstInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_forecast_bucket_first = /** @type {((inputs?: Invoices_Forecast_Bucket_FirstInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Forecast_Bucket_FirstInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_forecast_bucket_first(inputs)
	return en_invoices_forecast_bucket_first(inputs)
});
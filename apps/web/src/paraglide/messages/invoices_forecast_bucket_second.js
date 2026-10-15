/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Forecast_Bucket_SecondInputs */



/**
* | output |
* | --- |
* | "31 – 60 d" |
*
* @param {Invoices_Forecast_Bucket_SecondInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_forecast_bucket_second = /** @type {((inputs?: Invoices_Forecast_Bucket_SecondInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Forecast_Bucket_SecondInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("31 – 60 j")
	return /** @type {LocalizedString} */ ("31 – 60 d")
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Forecast_TitleInputs */

const en_invoices_forecast_title = /** @type {(inputs: Invoices_Forecast_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected within 60 days`)
};

const fr_invoices_forecast_title = /** @type {(inputs: Invoices_Forecast_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attendu sur 60 jours`)
};

/**
* | output |
* | --- |
* | "Expected within 60 days" |
*
* @param {Invoices_Forecast_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_forecast_title = /** @type {((inputs?: Invoices_Forecast_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Forecast_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_forecast_title(inputs)
	return en_invoices_forecast_title(inputs)
});
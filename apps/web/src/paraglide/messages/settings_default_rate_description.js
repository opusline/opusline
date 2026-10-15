/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Default_Rate_DescriptionInputs */



/**
* | output |
* | --- |
* | "Rate applied by default to new invoices." |
*
* @param {Settings_Default_Rate_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_default_rate_description = /** @type {((inputs?: Settings_Default_Rate_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Default_Rate_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Taux appliqué par défaut aux nouvelles factures.")
	return /** @type {LocalizedString} */ ("Rate applied by default to new invoices.")
});
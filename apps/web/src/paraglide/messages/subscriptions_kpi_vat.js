/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_VatInputs */

const en_subscriptions_kpi_vat = /** @type {(inputs: Subscriptions_Kpi_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recoverable TVA`)
};

const fr_subscriptions_kpi_vat = /** @type {(inputs: Subscriptions_Kpi_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA récupérable`)
};

/**
* | output |
* | --- |
* | "Recoverable TVA" |
*
* @param {Subscriptions_Kpi_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_vat = /** @type {((inputs?: Subscriptions_Kpi_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_vat(inputs)
	return en_subscriptions_kpi_vat(inputs)
});
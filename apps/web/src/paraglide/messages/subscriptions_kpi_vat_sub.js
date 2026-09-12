/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Kpi_Vat_SubInputs */

const en_subscriptions_kpi_vat_sub = /** @type {(inputs: Subscriptions_Kpi_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of which ${i?.amount} reverse charged (due and deducted)`)
};

const fr_subscriptions_kpi_vat_sub = /** @type {(inputs: Subscriptions_Kpi_Vat_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`dont ${i?.amount} autoliquidés (due et déduite)`)
};

/**
* | output |
* | --- |
* | "of which {amount} reverse charged (due and deducted)" |
*
* @param {Subscriptions_Kpi_Vat_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_vat_sub = /** @type {((inputs: Subscriptions_Kpi_Vat_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_Vat_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_vat_sub(inputs)
	return en_subscriptions_kpi_vat_sub(inputs)
});
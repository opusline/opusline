/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Kpi_None_ProvisionedInputs */

const en_subscriptions_kpi_none_provisioned = /** @type {(inputs: Subscriptions_Kpi_None_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`none set aside`)
};

const fr_subscriptions_kpi_none_provisioned = /** @type {(inputs: Subscriptions_Kpi_None_ProvisionedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucun provisionné`)
};

/**
* | output |
* | --- |
* | "none set aside" |
*
* @param {Subscriptions_Kpi_None_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_kpi_none_provisioned = /** @type {((inputs?: Subscriptions_Kpi_None_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Kpi_None_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_kpi_none_provisioned(inputs)
	return en_subscriptions_kpi_none_provisioned(inputs)
});
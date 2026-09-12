/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown>, amount: NonNullable<unknown> }} Subscriptions_ProvisionedInputs */

const en_subscriptions_provisioned = /** @type {(inputs: Subscriptions_ProvisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · ${i?.amount} / month set aside in Trésorerie`)
};

const fr_subscriptions_provisioned = /** @type {(inputs: Subscriptions_ProvisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · ${i?.amount} / mois mis de côté dans Trésorerie`)
};

/**
* | output |
* | --- |
* | "{supplier} · {amount} / month set aside in Trésorerie" |
*
* @param {Subscriptions_ProvisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_provisioned = /** @type {((inputs: Subscriptions_ProvisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_ProvisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_provisioned(inputs)
	return en_subscriptions_provisioned(inputs)
});
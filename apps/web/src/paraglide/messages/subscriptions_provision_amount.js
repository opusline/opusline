/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Provision_AmountInputs */

const en_subscriptions_provision_amount = /** @type {(inputs: Subscriptions_Provision_AmountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / month set aside in Trésorerie.`)
};

const fr_subscriptions_provision_amount = /** @type {(inputs: Subscriptions_Provision_AmountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / mois mis de côté dans Trésorerie.`)
};

/**
* | output |
* | --- |
* | "{amount} / month set aside in Trésorerie." |
*
* @param {Subscriptions_Provision_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_provision_amount = /** @type {((inputs: Subscriptions_Provision_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Provision_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_provision_amount(inputs)
	return en_subscriptions_provision_amount(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Provision_HintInputs */

const en_subscriptions_provision_hint = /** @type {(inputs: Subscriptions_Provision_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Smooths the yearly debit in Trésorerie.`)
};

const fr_subscriptions_provision_hint = /** @type {(inputs: Subscriptions_Provision_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lisse le prélèvement annuel dans Trésorerie.`)
};

/**
* | output |
* | --- |
* | "Smooths the yearly debit in Trésorerie." |
*
* @param {Subscriptions_Provision_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_provision_hint = /** @type {((inputs?: Subscriptions_Provision_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Provision_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_provision_hint(inputs)
	return en_subscriptions_provision_hint(inputs)
});
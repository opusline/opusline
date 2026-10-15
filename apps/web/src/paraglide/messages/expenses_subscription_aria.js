/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Subscription_AriaInputs */

const en_expenses_subscription_aria = /** @type {(inputs: Expenses_Subscription_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscription`)
};

const fr_expenses_subscription_aria = /** @type {(inputs: Expenses_Subscription_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnement`)
};

/**
* | output |
* | --- |
* | "Subscription" |
*
* @param {Expenses_Subscription_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_subscription_aria = /** @type {((inputs?: Expenses_Subscription_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Subscription_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_subscription_aria(inputs)
	return en_expenses_subscription_aria(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Tab_SubscriptionsInputs */

const en_expenses_tab_subscriptions = /** @type {(inputs: Expenses_Tab_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscriptions`)
};

const fr_expenses_tab_subscriptions = /** @type {(inputs: Expenses_Tab_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnements`)
};

/**
* | output |
* | --- |
* | "Subscriptions" |
*
* @param {Expenses_Tab_SubscriptionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_tab_subscriptions = /** @type {((inputs?: Expenses_Tab_SubscriptionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Tab_SubscriptionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_tab_subscriptions(inputs)
	return en_expenses_tab_subscriptions(inputs)
});
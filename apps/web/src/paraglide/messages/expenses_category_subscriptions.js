/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Category_SubscriptionsInputs */

const en_expenses_category_subscriptions = /** @type {(inputs: Expenses_Category_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscriptions`)
};

const fr_expenses_category_subscriptions = /** @type {(inputs: Expenses_Category_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnements`)
};

/**
* | output |
* | --- |
* | "Subscriptions" |
*
* @param {Expenses_Category_SubscriptionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_category_subscriptions = /** @type {((inputs?: Expenses_Category_SubscriptionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Category_SubscriptionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_category_subscriptions(inputs)
	return en_expenses_category_subscriptions(inputs)
});
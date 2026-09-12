/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Todo_All_SubscriptionsInputs */

const en_expenses_todo_all_subscriptions = /** @type {(inputs: Expenses_Todo_All_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All subscriptions →`)
};

const fr_expenses_todo_all_subscriptions = /** @type {(inputs: Expenses_Todo_All_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous les abonnements →`)
};

/**
* | output |
* | --- |
* | "All subscriptions →" |
*
* @param {Expenses_Todo_All_SubscriptionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_todo_all_subscriptions = /** @type {((inputs?: Expenses_Todo_All_SubscriptionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Todo_All_SubscriptionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_todo_all_subscriptions(inputs)
	return en_expenses_todo_all_subscriptions(inputs)
});
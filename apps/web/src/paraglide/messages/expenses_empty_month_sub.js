/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Empty_Month_SubInputs */

const en_expenses_empty_month_sub = /** @type {(inputs: Expenses_Empty_Month_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscriptions are created on their debit day.`)
};

const fr_expenses_empty_month_sub = /** @type {(inputs: Expenses_Empty_Month_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les abonnements seront créés à leur prélèvement.`)
};

/**
* | output |
* | --- |
* | "Subscriptions are created on their debit day." |
*
* @param {Expenses_Empty_Month_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_empty_month_sub = /** @type {((inputs?: Expenses_Empty_Month_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Empty_Month_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_empty_month_sub(inputs)
	return en_expenses_empty_month_sub(inputs)
});
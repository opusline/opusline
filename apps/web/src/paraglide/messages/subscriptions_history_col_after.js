/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_Col_AfterInputs */

const en_subscriptions_history_col_after = /** @type {(inputs: Subscriptions_History_Col_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`After`)
};

const fr_subscriptions_history_col_after = /** @type {(inputs: Subscriptions_History_Col_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Après`)
};

/**
* | output |
* | --- |
* | "After" |
*
* @param {Subscriptions_History_Col_AfterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_col_after = /** @type {((inputs?: Subscriptions_History_Col_AfterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_Col_AfterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_col_after(inputs)
	return en_subscriptions_history_col_after(inputs)
});
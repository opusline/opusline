/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_Col_SinceInputs */

const en_subscriptions_history_col_since = /** @type {(inputs: Subscriptions_History_Col_SinceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Since`)
};

const fr_subscriptions_history_col_since = /** @type {(inputs: Subscriptions_History_Col_SinceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Depuis le`)
};

/**
* | output |
* | --- |
* | "Since" |
*
* @param {Subscriptions_History_Col_SinceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_col_since = /** @type {((inputs?: Subscriptions_History_Col_SinceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_Col_SinceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_col_since(inputs)
	return en_subscriptions_history_col_since(inputs)
});
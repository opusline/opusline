/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_Col_BeforeInputs */

const en_subscriptions_history_col_before = /** @type {(inputs: Subscriptions_History_Col_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Before`)
};

const fr_subscriptions_history_col_before = /** @type {(inputs: Subscriptions_History_Col_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avant`)
};

/**
* | output |
* | --- |
* | "Before" |
*
* @param {Subscriptions_History_Col_BeforeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_col_before = /** @type {((inputs?: Subscriptions_History_Col_BeforeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_Col_BeforeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_col_before(inputs)
	return en_subscriptions_history_col_before(inputs)
});
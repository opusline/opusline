/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Col_PeriodicityInputs */

const en_subscriptions_col_periodicity = /** @type {(inputs: Subscriptions_Col_PeriodicityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Periodicity`)
};

const fr_subscriptions_col_periodicity = /** @type {(inputs: Subscriptions_Col_PeriodicityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Périodicité`)
};

/**
* | output |
* | --- |
* | "Periodicity" |
*
* @param {Subscriptions_Col_PeriodicityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_col_periodicity = /** @type {((inputs?: Subscriptions_Col_PeriodicityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Col_PeriodicityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_col_periodicity(inputs)
	return en_subscriptions_col_periodicity(inputs)
});
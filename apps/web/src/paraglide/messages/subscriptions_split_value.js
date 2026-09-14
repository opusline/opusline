/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Split_ValueInputs */

const en_subscriptions_split_value = /** @type {(inputs: Subscriptions_Split_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / year`)
};

const fr_subscriptions_split_value = /** @type {(inputs: Subscriptions_Split_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} / an`)
};

/**
* | output |
* | --- |
* | "{amount} / year" |
*
* @param {Subscriptions_Split_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_split_value = /** @type {((inputs: Subscriptions_Split_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Split_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_split_value(inputs)
	return en_subscriptions_split_value(inputs)
});
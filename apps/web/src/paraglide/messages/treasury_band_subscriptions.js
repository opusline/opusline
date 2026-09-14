/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Band_SubscriptionsInputs */

const en_treasury_band_subscriptions = /** @type {(inputs: Treasury_Band_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subscriptions to set aside`)
};

const fr_treasury_band_subscriptions = /** @type {(inputs: Treasury_Band_SubscriptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abonnements à provisionner`)
};

/**
* | output |
* | --- |
* | "Subscriptions to set aside" |
*
* @param {Treasury_Band_SubscriptionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_band_subscriptions = /** @type {((inputs?: Treasury_Band_SubscriptionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Band_SubscriptionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_band_subscriptions(inputs)
	return en_treasury_band_subscriptions(inputs)
});
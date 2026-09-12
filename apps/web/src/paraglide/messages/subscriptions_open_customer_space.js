/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Open_Customer_SpaceInputs */

const en_subscriptions_open_customer_space = /** @type {(inputs: Subscriptions_Open_Customer_SpaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the customer space`)
};

const fr_subscriptions_open_customer_space = /** @type {(inputs: Subscriptions_Open_Customer_SpaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir l'espace client`)
};

/**
* | output |
* | --- |
* | "Open the customer space" |
*
* @param {Subscriptions_Open_Customer_SpaceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_open_customer_space = /** @type {((inputs?: Subscriptions_Open_Customer_SpaceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Open_Customer_SpaceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_open_customer_space(inputs)
	return en_subscriptions_open_customer_space(inputs)
});
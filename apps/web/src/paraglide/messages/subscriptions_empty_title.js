/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Empty_TitleInputs */

const en_subscriptions_empty_title = /** @type {(inputs: Subscriptions_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No subscriptions`)
};

const fr_subscriptions_empty_title = /** @type {(inputs: Subscriptions_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun abonnement`)
};

/**
* | output |
* | --- |
* | "No subscriptions" |
*
* @param {Subscriptions_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_empty_title = /** @type {((inputs?: Subscriptions_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_empty_title(inputs)
	return en_subscriptions_empty_title(inputs)
});
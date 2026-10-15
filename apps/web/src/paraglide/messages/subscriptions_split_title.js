/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Split_TitleInputs */

const en_subscriptions_split_title = /** @type {(inputs: Subscriptions_Split_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yearly split · HT`)
};

const fr_subscriptions_split_title = /** @type {(inputs: Subscriptions_Split_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Répartition annuelle · HT`)
};

/**
* | output |
* | --- |
* | "Yearly split · HT" |
*
* @param {Subscriptions_Split_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_split_title = /** @type {((inputs?: Subscriptions_Split_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Split_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_split_title(inputs)
	return en_subscriptions_split_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_All_Cancelled_TitleInputs */

const en_subscriptions_all_cancelled_title = /** @type {(inputs: Subscriptions_All_Cancelled_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every subscription is cancelled`)
};

const fr_subscriptions_all_cancelled_title = /** @type {(inputs: Subscriptions_All_Cancelled_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous les abonnements sont résiliés`)
};

/**
* | output |
* | --- |
* | "Every subscription is cancelled" |
*
* @param {Subscriptions_All_Cancelled_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_all_cancelled_title = /** @type {((inputs?: Subscriptions_All_Cancelled_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_All_Cancelled_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_all_cancelled_title(inputs)
	return en_subscriptions_all_cancelled_title(inputs)
});
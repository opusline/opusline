/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Upcoming_TitleInputs */

const en_subscriptions_upcoming_title = /** @type {(inputs: Subscriptions_Upcoming_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next debits · 30 days`)
};

const fr_subscriptions_upcoming_title = /** @type {(inputs: Subscriptions_Upcoming_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prochains prélèvements · 30 jours`)
};

/**
* | output |
* | --- |
* | "Next debits · 30 days" |
*
* @param {Subscriptions_Upcoming_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_title = /** @type {((inputs?: Subscriptions_Upcoming_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_title(inputs)
	return en_subscriptions_upcoming_title(inputs)
});
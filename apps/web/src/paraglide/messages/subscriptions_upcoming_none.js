/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Upcoming_NoneInputs */

const en_subscriptions_upcoming_none = /** @type {(inputs: Subscriptions_Upcoming_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No debit in the next thirty days.`)
};

const fr_subscriptions_upcoming_none = /** @type {(inputs: Subscriptions_Upcoming_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun prélèvement d'ici trente jours.`)
};

/**
* | output |
* | --- |
* | "No debit in the next thirty days." |
*
* @param {Subscriptions_Upcoming_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_none = /** @type {((inputs?: Subscriptions_Upcoming_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_none(inputs)
	return en_subscriptions_upcoming_none(inputs)
});
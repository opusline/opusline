/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Subscriptions_Upcoming_ByInputs */

const en_subscriptions_upcoming_by = /** @type {(inputs: Subscriptions_Upcoming_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`by ${i?.date}`)
};

const fr_subscriptions_upcoming_by = /** @type {(inputs: Subscriptions_Upcoming_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`d'ici le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "by {date}" |
*
* @param {Subscriptions_Upcoming_ByInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_by = /** @type {((inputs: Subscriptions_Upcoming_ByInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_ByInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_by(inputs)
	return en_subscriptions_upcoming_by(inputs)
});
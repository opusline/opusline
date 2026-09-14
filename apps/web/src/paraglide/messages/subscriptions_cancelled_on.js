/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Subscriptions_Cancelled_OnInputs */

const en_subscriptions_cancelled_on = /** @type {(inputs: Subscriptions_Cancelled_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on ${i?.date}`)
};

const fr_subscriptions_cancelled_on = /** @type {(inputs: Subscriptions_Cancelled_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "on {date}" |
*
* @param {Subscriptions_Cancelled_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_cancelled_on = /** @type {((inputs: Subscriptions_Cancelled_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Cancelled_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_cancelled_on(inputs)
	return en_subscriptions_cancelled_on(inputs)
});
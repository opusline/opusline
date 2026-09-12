/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Subscriptions_Cancelled_ToggleInputs */

const en_subscriptions_cancelled_toggle = /** @type {(inputs: Subscriptions_Cancelled_ToggleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Cancelled (${i?.count})`)
};

const fr_subscriptions_cancelled_toggle = /** @type {(inputs: Subscriptions_Cancelled_ToggleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Résiliés (${i?.count})`)
};

/**
* | output |
* | --- |
* | "Cancelled ({count})" |
*
* @param {Subscriptions_Cancelled_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_cancelled_toggle = /** @type {((inputs: Subscriptions_Cancelled_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Cancelled_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_cancelled_toggle(inputs)
	return en_subscriptions_cancelled_toggle(inputs)
});
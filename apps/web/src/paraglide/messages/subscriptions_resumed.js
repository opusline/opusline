/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_ResumedInputs */

const en_subscriptions_resumed = /** @type {(inputs: Subscriptions_ResumedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} resumed`)
};

const fr_subscriptions_resumed = /** @type {(inputs: Subscriptions_ResumedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} repris`)
};

/**
* | output |
* | --- |
* | "{supplier} resumed" |
*
* @param {Subscriptions_ResumedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_resumed = /** @type {((inputs: Subscriptions_ResumedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_ResumedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_resumed(inputs)
	return en_subscriptions_resumed(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_PausedInputs */

const en_subscriptions_paused = /** @type {(inputs: Subscriptions_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} paused · no expense will be created`)
};

const fr_subscriptions_paused = /** @type {(inputs: Subscriptions_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} en pause · aucune dépense ne sera créée`)
};

/**
* | output |
* | --- |
* | "{supplier} paused · no expense will be created" |
*
* @param {Subscriptions_PausedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_paused = /** @type {((inputs: Subscriptions_PausedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_PausedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_paused(inputs)
	return en_subscriptions_paused(inputs)
});
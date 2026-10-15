/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Col_NextInputs */

const en_subscriptions_col_next = /** @type {(inputs: Subscriptions_Col_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next`)
};

const fr_subscriptions_col_next = /** @type {(inputs: Subscriptions_Col_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prochain`)
};

/**
* | output |
* | --- |
* | "Next" |
*
* @param {Subscriptions_Col_NextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_col_next = /** @type {((inputs?: Subscriptions_Col_NextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Col_NextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_col_next(inputs)
	return en_subscriptions_col_next(inputs)
});
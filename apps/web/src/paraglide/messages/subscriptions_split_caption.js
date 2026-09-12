/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Subscriptions_Split_CaptionInputs */

const en_subscriptions_split_caption = /** @type {(inputs: Subscriptions_Split_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} HT / year`)
};

const fr_subscriptions_split_caption = /** @type {(inputs: Subscriptions_Split_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} HT / an`)
};

/**
* | output |
* | --- |
* | "{amount} HT / year" |
*
* @param {Subscriptions_Split_CaptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_split_caption = /** @type {((inputs: Subscriptions_Split_CaptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Split_CaptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_split_caption(inputs)
	return en_subscriptions_split_caption(inputs)
});
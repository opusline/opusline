/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_UnprovisionedInputs */

const en_subscriptions_unprovisioned = /** @type {(inputs: Subscriptions_UnprovisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · no monthly provision any more`)
};

const fr_subscriptions_unprovisioned = /** @type {(inputs: Subscriptions_UnprovisionedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · plus de provision mensuelle`)
};

/**
* | output |
* | --- |
* | "{supplier} · no monthly provision any more" |
*
* @param {Subscriptions_UnprovisionedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_unprovisioned = /** @type {((inputs: Subscriptions_UnprovisionedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_UnprovisionedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_unprovisioned(inputs)
	return en_subscriptions_unprovisioned(inputs)
});
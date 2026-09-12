/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_ReactivatedInputs */

const en_subscriptions_reactivated = /** @type {(inputs: Subscriptions_ReactivatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} reactivated · debits resume`)
};

const fr_subscriptions_reactivated = /** @type {(inputs: Subscriptions_ReactivatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} réactivé · les prélèvements reprennent`)
};

/**
* | output |
* | --- |
* | "{supplier} reactivated · debits resume" |
*
* @param {Subscriptions_ReactivatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_reactivated = /** @type {((inputs: Subscriptions_ReactivatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_ReactivatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_reactivated(inputs)
	return en_subscriptions_reactivated(inputs)
});
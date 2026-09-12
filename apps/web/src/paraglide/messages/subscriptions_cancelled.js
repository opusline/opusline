/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown>, date: NonNullable<unknown> }} Subscriptions_CancelledInputs */

const en_subscriptions_cancelled = /** @type {(inputs: Subscriptions_CancelledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} cancelled as of ${i?.date} · past expenses are kept`)
};

const fr_subscriptions_cancelled = /** @type {(inputs: Subscriptions_CancelledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} résilié au ${i?.date} · les dépenses passées sont conservées`)
};

/**
* | output |
* | --- |
* | "{supplier} cancelled as of {date} · past expenses are kept" |
*
* @param {Subscriptions_CancelledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_cancelled = /** @type {((inputs: Subscriptions_CancelledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_CancelledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_cancelled(inputs)
	return en_subscriptions_cancelled(inputs)
});
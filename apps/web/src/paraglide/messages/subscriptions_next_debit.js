/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Subscriptions_Next_DebitInputs */

const en_subscriptions_next_debit = /** @type {(inputs: Subscriptions_Next_DebitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`next ${i?.date}`)
};

const fr_subscriptions_next_debit = /** @type {(inputs: Subscriptions_Next_DebitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`prochain ${i?.date}`)
};

/**
* | output |
* | --- |
* | "next {date}" |
*
* @param {Subscriptions_Next_DebitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_next_debit = /** @type {((inputs: Subscriptions_Next_DebitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Next_DebitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_next_debit(inputs)
	return en_subscriptions_next_debit(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown>, periodicity: NonNullable<unknown> }} Subscriptions_Upcoming_LineInputs */

const en_subscriptions_upcoming_line = /** @type {(inputs: Subscriptions_Upcoming_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · ${i?.periodicity}`)
};

const fr_subscriptions_upcoming_line = /** @type {(inputs: Subscriptions_Upcoming_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · ${i?.periodicity}`)
};

/**
* | output |
* | --- |
* | "{date} · {periodicity}" |
*
* @param {Subscriptions_Upcoming_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_upcoming_line = /** @type {((inputs: Subscriptions_Upcoming_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Upcoming_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_upcoming_line(inputs)
	return en_subscriptions_upcoming_line(inputs)
});
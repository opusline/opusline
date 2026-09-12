/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, state: NonNullable<unknown> }} Subscriptions_Occurrence_TipInputs */

const en_subscriptions_occurrence_tip = /** @type {(inputs: Subscriptions_Occurrence_TipInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month} · ${i?.state}`)
};

const fr_subscriptions_occurrence_tip = /** @type {(inputs: Subscriptions_Occurrence_TipInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month} · ${i?.state}`)
};

/**
* | output |
* | --- |
* | "{month} · {state}" |
*
* @param {Subscriptions_Occurrence_TipInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_occurrence_tip = /** @type {((inputs: Subscriptions_Occurrence_TipInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Occurrence_TipInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_occurrence_tip(inputs)
	return en_subscriptions_occurrence_tip(inputs)
});
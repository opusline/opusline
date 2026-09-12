/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, supplier: NonNullable<unknown> }} Subscriptions_Occurrence_Link_AriaInputs */

const en_subscriptions_occurrence_link_aria = /** @type {(inputs: Subscriptions_Occurrence_Link_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Link the ${i?.month} receipt · ${i?.supplier}`)
};

const fr_subscriptions_occurrence_link_aria = /** @type {(inputs: Subscriptions_Occurrence_Link_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lier la facture de ${i?.month} · ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "Link the {month} receipt · {supplier}" |
*
* @param {Subscriptions_Occurrence_Link_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_occurrence_link_aria = /** @type {((inputs: Subscriptions_Occurrence_Link_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Occurrence_Link_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_occurrence_link_aria(inputs)
	return en_subscriptions_occurrence_link_aria(inputs)
});
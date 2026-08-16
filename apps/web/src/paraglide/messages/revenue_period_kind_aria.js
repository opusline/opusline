/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Period_Kind_AriaInputs */

const en_revenue_period_kind_aria = /** @type {(inputs: Revenue_Period_Kind_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period type`)
};

const fr_revenue_period_kind_aria = /** @type {(inputs: Revenue_Period_Kind_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type de période`)
};

/**
* | output |
* | --- |
* | "Period type" |
*
* @param {Revenue_Period_Kind_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_period_kind_aria = /** @type {((inputs?: Revenue_Period_Kind_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Period_Kind_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_period_kind_aria(inputs)
	return en_revenue_period_kind_aria(inputs)
});
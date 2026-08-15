/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Not_Billable_ValueInputs */

const en_timer_not_billable_value = /** @type {(inputs: Timer_Not_Billable_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non-billable`)
};

const fr_timer_not_billable_value = /** @type {(inputs: Timer_Not_Billable_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non facturable`)
};

/**
* | output |
* | --- |
* | "non-billable" |
*
* @param {Timer_Not_Billable_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_not_billable_value = /** @type {((inputs?: Timer_Not_Billable_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Not_Billable_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_not_billable_value(inputs)
	return en_timer_not_billable_value(inputs)
});
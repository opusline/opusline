/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Non_BillableInputs */

const en_timer_non_billable = /** @type {(inputs: Timer_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-billable`)
};

const fr_timer_non_billable = /** @type {(inputs: Timer_Non_BillableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non facturable`)
};

/**
* | output |
* | --- |
* | "Non-billable" |
*
* @param {Timer_Non_BillableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_non_billable = /** @type {((inputs?: Timer_Non_BillableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Non_BillableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_non_billable(inputs)
	return en_timer_non_billable(inputs)
});
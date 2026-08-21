/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Timer_Billable_Amount_LabelInputs */

const en_timer_billable_amount_label = /** @type {(inputs: Timer_Billable_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billable amount`)
};

const fr_timer_billable_amount_label = /** @type {(inputs: Timer_Billable_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant facturable`)
};

/**
* | output |
* | --- |
* | "Billable amount" |
*
* @param {Timer_Billable_Amount_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const timer_billable_amount_label = /** @type {((inputs?: Timer_Billable_Amount_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Timer_Billable_Amount_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_timer_billable_amount_label(inputs)
	return en_timer_billable_amount_label(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Invoices_State_Days_LateInputs */

const en_invoices_state_days_late = /** @type {(inputs: Invoices_State_Days_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d late`)
};

const fr_invoices_state_days_late = /** @type {(inputs: Invoices_State_Days_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} j de retard`)
};

/**
* | output |
* | --- |
* | "{days} d late" |
*
* @param {Invoices_State_Days_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_state_days_late = /** @type {((inputs: Invoices_State_Days_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_State_Days_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_state_days_late(inputs)
	return en_invoices_state_days_late(inputs)
});
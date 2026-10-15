/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_Period_LabelInputs */

const en_invoices_add_period_label = /** @type {(inputs: Invoices_Add_Period_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Period`)
};

const fr_invoices_add_period_label = /** @type {(inputs: Invoices_Add_Period_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Période`)
};

/**
* | output |
* | --- |
* | "Period" |
*
* @param {Invoices_Add_Period_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_period_label = /** @type {((inputs?: Invoices_Add_Period_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Period_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_period_label(inputs)
	return en_invoices_add_period_label(inputs)
});
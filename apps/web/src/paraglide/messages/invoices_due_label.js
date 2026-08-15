/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Due_LabelInputs */

const en_invoices_due_label = /** @type {(inputs: Invoices_Due_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Due`)
};

const fr_invoices_due_label = /** @type {(inputs: Invoices_Due_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéance`)
};

/**
* | output |
* | --- |
* | "Due" |
*
* @param {Invoices_Due_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_due_label = /** @type {((inputs?: Invoices_Due_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Due_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_due_label(inputs)
	return en_invoices_due_label(inputs)
});
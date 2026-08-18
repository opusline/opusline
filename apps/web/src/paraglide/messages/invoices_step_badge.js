/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Step_BadgeInputs */

const en_invoices_step_badge = /** @type {(inputs: Invoices_Step_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Step due`)
};

const fr_invoices_step_badge = /** @type {(inputs: Invoices_Step_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échéance`)
};

/**
* | output |
* | --- |
* | "Step due" |
*
* @param {Invoices_Step_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_step_badge = /** @type {((inputs?: Invoices_Step_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Step_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_step_badge(inputs)
	return en_invoices_step_badge(inputs)
});
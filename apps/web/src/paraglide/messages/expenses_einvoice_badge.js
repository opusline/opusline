/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ status: NonNullable<unknown> }} Expenses_Einvoice_BadgeInputs */

const en_expenses_einvoice_badge = /** @type {(inputs: Expenses_Einvoice_BadgeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Platform · ${i?.status}`)
};

const fr_expenses_einvoice_badge = /** @type {(inputs: Expenses_Einvoice_BadgeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plateforme · ${i?.status}`)
};

/**
* | output |
* | --- |
* | "Platform · {status}" |
*
* @param {Expenses_Einvoice_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_einvoice_badge = /** @type {((inputs: Expenses_Einvoice_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Einvoice_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_einvoice_badge(inputs)
	return en_expenses_einvoice_badge(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Non_Eu_LabelInputs */

const en_expense_vat_non_eu_label = /** @type {(inputs: Expense_Vat_Non_Eu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliq. non-EU`)
};

const fr_expense_vat_non_eu_label = /** @type {(inputs: Expense_Vat_Non_Eu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliq. hors UE`)
};

/**
* | output |
* | --- |
* | "Autoliq. non-EU" |
*
* @param {Expense_Vat_Non_Eu_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_non_eu_label = /** @type {((inputs?: Expense_Vat_Non_Eu_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Non_Eu_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_non_eu_label(inputs)
	return en_expense_vat_non_eu_label(inputs)
});
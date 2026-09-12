/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Vat_Action_FailedInputs */

const en_expenses_vat_action_failed = /** @type {(inputs: Expenses_Vat_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This expense's TVA could not be moved. Try again in a moment.`)
};

const fr_expenses_vat_action_failed = /** @type {(inputs: Expenses_Vat_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La TVA de cette dépense n'a pas pu être déplacée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "This expense's TVA could not be moved. Try again in a moment." |
*
* @param {Expenses_Vat_Action_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_vat_action_failed = /** @type {((inputs?: Expenses_Vat_Action_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Vat_Action_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_vat_action_failed(inputs)
	return en_expenses_vat_action_failed(inputs)
});
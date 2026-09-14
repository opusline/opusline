/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Delete_ConfirmInputs */

const en_expenses_delete_confirm = /** @type {(inputs: Expenses_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the expense`)
};

const fr_expenses_delete_confirm = /** @type {(inputs: Expenses_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer la dépense`)
};

/**
* | output |
* | --- |
* | "Delete the expense" |
*
* @param {Expenses_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_delete_confirm = /** @type {((inputs?: Expenses_Delete_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Delete_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_delete_confirm(inputs)
	return en_expenses_delete_confirm(inputs)
});
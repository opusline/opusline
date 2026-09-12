/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Delete_FailedInputs */

const en_expenses_delete_failed = /** @type {(inputs: Expenses_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The expense could not be deleted. Try again in a moment.`)
};

const fr_expenses_delete_failed = /** @type {(inputs: Expenses_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La dépense n'a pas pu être supprimée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The expense could not be deleted. Try again in a moment." |
*
* @param {Expenses_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_delete_failed = /** @type {((inputs?: Expenses_Delete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Delete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_delete_failed(inputs)
	return en_expenses_delete_failed(inputs)
});
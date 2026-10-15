/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Delete_FailedInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La dépense n'a pas pu être supprimée. Réessayez dans un instant.")
	return /** @type {LocalizedString} */ ("The expense could not be deleted. Try again in a moment.")
});
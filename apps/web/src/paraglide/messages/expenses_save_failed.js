/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Save_FailedInputs */

const en_expenses_save_failed = /** @type {(inputs: Expenses_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The expense could not be saved. Try again in a moment.`)
};

const fr_expenses_save_failed = /** @type {(inputs: Expenses_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La dépense n'a pas pu être enregistrée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The expense could not be saved. Try again in a moment." |
*
* @param {Expenses_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_save_failed = /** @type {((inputs?: Expenses_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_save_failed(inputs)
	return en_expenses_save_failed(inputs)
});
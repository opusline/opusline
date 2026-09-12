/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Recategorize_FailedInputs */

const en_expenses_recategorize_failed = /** @type {(inputs: Expenses_Recategorize_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The category could not be changed. Try again in a moment.`)
};

const fr_expenses_recategorize_failed = /** @type {(inputs: Expenses_Recategorize_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La catégorie n'a pas pu être changée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The category could not be changed. Try again in a moment." |
*
* @param {Expenses_Recategorize_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_recategorize_failed = /** @type {((inputs?: Expenses_Recategorize_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Recategorize_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_recategorize_failed(inputs)
	return en_expenses_recategorize_failed(inputs)
});
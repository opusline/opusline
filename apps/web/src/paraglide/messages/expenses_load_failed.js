/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Load_FailedInputs */

const en_expenses_load_failed = /** @type {(inputs: Expenses_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The expenses could not be loaded. Try again in a moment.`)
};

const fr_expenses_load_failed = /** @type {(inputs: Expenses_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les dépenses n'ont pas pu être chargées. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The expenses could not be loaded. Try again in a moment." |
*
* @param {Expenses_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_load_failed = /** @type {((inputs?: Expenses_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_load_failed(inputs)
	return en_expenses_load_failed(inputs)
});
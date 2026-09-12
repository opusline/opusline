/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Recurring_HintInputs */

const en_expenses_recurring_hint = /** @type {(inputs: Expenses_Recurring_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An expense is created on that day every month, with this amount and this TVA.`)
};

const fr_expenses_recurring_hint = /** @type {(inputs: Expenses_Recurring_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une dépense sera créée chaque mois ce jour-là, avec ce montant et cette TVA.`)
};

/**
* | output |
* | --- |
* | "An expense is created on that day every month, with this amount and this TVA." |
*
* @param {Expenses_Recurring_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_recurring_hint = /** @type {((inputs?: Expenses_Recurring_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Recurring_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_recurring_hint(inputs)
	return en_expenses_recurring_hint(inputs)
});
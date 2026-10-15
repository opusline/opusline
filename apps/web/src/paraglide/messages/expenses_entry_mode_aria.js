/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Entry_Mode_AriaInputs */

const en_expenses_entry_mode_aria = /** @type {(inputs: Expenses_Entry_Mode_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entry mode`)
};

const fr_expenses_entry_mode_aria = /** @type {(inputs: Expenses_Entry_Mode_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mode de saisie`)
};

/**
* | output |
* | --- |
* | "Entry mode" |
*
* @param {Expenses_Entry_Mode_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_entry_mode_aria = /** @type {((inputs?: Expenses_Entry_Mode_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Entry_Mode_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_entry_mode_aria(inputs)
	return en_expenses_entry_mode_aria(inputs)
});
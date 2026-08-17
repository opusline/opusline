/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Overdue_GroupInputs */

const en_deadlines_overdue_group = /** @type {(inputs: Deadlines_Overdue_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overdue`)
};

const fr_deadlines_overdue_group = /** @type {(inputs: Deadlines_Overdue_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En retard`)
};

/**
* | output |
* | --- |
* | "Overdue" |
*
* @param {Deadlines_Overdue_GroupInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_overdue_group = /** @type {((inputs?: Deadlines_Overdue_GroupInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Overdue_GroupInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_overdue_group(inputs)
	return en_deadlines_overdue_group(inputs)
});
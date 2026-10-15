/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Deadline_OverdueInputs */

const en_declarations_deadline_overdue = /** @type {(inputs: Declarations_Deadline_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· overdue`)
};

const fr_declarations_deadline_overdue = /** @type {(inputs: Declarations_Deadline_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· échéance dépassée`)
};

/**
* | output |
* | --- |
* | "· overdue" |
*
* @param {Declarations_Deadline_OverdueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_overdue = /** @type {((inputs?: Declarations_Deadline_OverdueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_OverdueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_overdue(inputs)
	return en_declarations_deadline_overdue(inputs)
});
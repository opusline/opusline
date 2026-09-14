/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Deadline_TodayInputs */

const en_declarations_deadline_today = /** @type {(inputs: Declarations_Deadline_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· today`)
};

const fr_declarations_deadline_today = /** @type {(inputs: Declarations_Deadline_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· aujourd'hui`)
};

/**
* | output |
* | --- |
* | "· today" |
*
* @param {Declarations_Deadline_TodayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_today = /** @type {((inputs?: Declarations_Deadline_TodayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_TodayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_today(inputs)
	return en_declarations_deadline_today(inputs)
});
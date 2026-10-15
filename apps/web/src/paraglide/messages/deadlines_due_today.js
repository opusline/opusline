/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Due_TodayInputs */

const en_deadlines_due_today = /** @type {(inputs: Deadlines_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`today`)
};

const fr_deadlines_due_today = /** @type {(inputs: Deadlines_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aujourd’hui`)
};

/**
* | output |
* | --- |
* | "today" |
*
* @param {Deadlines_Due_TodayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_due_today = /** @type {((inputs?: Deadlines_Due_TodayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Due_TodayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_due_today(inputs)
	return en_deadlines_due_today(inputs)
});
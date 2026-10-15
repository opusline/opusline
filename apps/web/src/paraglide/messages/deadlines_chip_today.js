/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Chip_TodayInputs */

const en_deadlines_chip_today = /** @type {(inputs: Deadlines_Chip_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

const fr_deadlines_chip_today = /** @type {(inputs: Deadlines_Chip_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aujourd'hui`)
};

/**
* | output |
* | --- |
* | "Today" |
*
* @param {Deadlines_Chip_TodayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_chip_today = /** @type {((inputs?: Deadlines_Chip_TodayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Chip_TodayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_chip_today(inputs)
	return en_deadlines_chip_today(inputs)
});
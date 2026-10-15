/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_WeekInputs */

const en_nav_week = /** @type {(inputs: Nav_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Week`)
};

const fr_nav_week = /** @type {(inputs: Nav_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semaine`)
};

/**
* | output |
* | --- |
* | "Week" |
*
* @param {Nav_WeekInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_week = /** @type {((inputs?: Nav_WeekInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_WeekInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_week(inputs)
	return en_nav_week(inputs)
});
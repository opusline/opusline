/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Open_WeekInputs */

const en_missions_open_week = /** @type {(inputs: Missions_Open_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the week →`)
};

const fr_missions_open_week = /** @type {(inputs: Missions_Open_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir la semaine →`)
};

/**
* | output |
* | --- |
* | "Open the week →" |
*
* @param {Missions_Open_WeekInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_open_week = /** @type {((inputs?: Missions_Open_WeekInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Open_WeekInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_open_week(inputs)
	return en_missions_open_week(inputs)
});
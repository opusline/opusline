/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unit_Short_DailyInputs */

const en_missions_unit_short_daily = /** @type {(inputs: Missions_Unit_Short_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / d`)
};

const fr_missions_unit_short_daily = /** @type {(inputs: Missions_Unit_Short_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / j`)
};

/**
* | output |
* | --- |
* | "/ d" |
*
* @param {Missions_Unit_Short_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unit_short_daily = /** @type {((inputs?: Missions_Unit_Short_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unit_Short_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unit_short_daily(inputs)
	return en_missions_unit_short_daily(inputs)
});
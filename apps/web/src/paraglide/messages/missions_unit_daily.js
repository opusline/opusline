/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unit_DailyInputs */

const en_missions_unit_daily = /** @type {(inputs: Missions_Unit_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / day`)
};

const fr_missions_unit_daily = /** @type {(inputs: Missions_Unit_DailyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / jour`)
};

/**
* | output |
* | --- |
* | "/ day" |
*
* @param {Missions_Unit_DailyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unit_daily = /** @type {((inputs?: Missions_Unit_DailyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unit_DailyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unit_daily(inputs)
	return en_missions_unit_daily(inputs)
});
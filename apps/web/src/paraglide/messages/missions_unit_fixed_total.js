/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unit_Fixed_TotalInputs */

const en_missions_unit_fixed_total = /** @type {(inputs: Missions_Unit_Fixed_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` HT in total`)
};

const fr_missions_unit_fixed_total = /** @type {(inputs: Missions_Unit_Fixed_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` HT au total`)
};

/**
* | output |
* | --- |
* | "HT in total" |
*
* @param {Missions_Unit_Fixed_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unit_fixed_total = /** @type {((inputs?: Missions_Unit_Fixed_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unit_Fixed_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unit_fixed_total(inputs)
	return en_missions_unit_fixed_total(inputs)
});
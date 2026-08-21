/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_ForfaitInputs */

const en_missions_stat_forfait = /** @type {(inputs: Missions_Stat_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed price`)
};

const fr_missions_stat_forfait = /** @type {(inputs: Missions_Stat_ForfaitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Forfait`)
};

/**
* | output |
* | --- |
* | "Fixed price" |
*
* @param {Missions_Stat_ForfaitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_forfait = /** @type {((inputs?: Missions_Stat_ForfaitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_ForfaitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_forfait(inputs)
	return en_missions_stat_forfait(inputs)
});
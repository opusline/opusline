/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_ConsumedInputs */

const en_missions_stat_consumed = /** @type {(inputs: Missions_Stat_ConsumedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Consumed`)
};

const fr_missions_stat_consumed = /** @type {(inputs: Missions_Stat_ConsumedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Consommé`)
};

/**
* | output |
* | --- |
* | "Consumed" |
*
* @param {Missions_Stat_ConsumedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_consumed = /** @type {((inputs?: Missions_Stat_ConsumedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_ConsumedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_consumed(inputs)
	return en_missions_stat_consumed(inputs)
});
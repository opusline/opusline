/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rate_RequiredInputs */

const en_missions_rate_required = /** @type {(inputs: Missions_Rate_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set a rate for this mission.`)
};

const fr_missions_rate_required = /** @type {(inputs: Missions_Rate_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un tarif pour cette mission.`)
};

/**
* | output |
* | --- |
* | "Set a rate for this mission." |
*
* @param {Missions_Rate_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rate_required = /** @type {((inputs?: Missions_Rate_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rate_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rate_required(inputs)
	return en_missions_rate_required(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Target_Rate_HintInputs */

const en_missions_target_rate_hint = /** @type {(inputs: Missions_Target_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Optional. Your usual TJM, so the fixed price reads as a number of days and the mission can tell you when it goes over.`)
};

const fr_missions_target_rate_hint = /** @type {(inputs: Missions_Target_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facultatif. Votre TJM habituel : le forfait se lit alors en nombre de jours et la mission vous prévient quand elle le dépasse.`)
};

/**
* | output |
* | --- |
* | "Optional. Your usual TJM, so the fixed price reads as a number of days and the mission can tell you when it goes over." |
*
* @param {Missions_Target_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_target_rate_hint = /** @type {((inputs?: Missions_Target_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Target_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_target_rate_hint(inputs)
	return en_missions_target_rate_hint(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_AddInputs */

const en_missions_schedule_add = /** @type {(inputs: Missions_Schedule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an instalment`)
};

const fr_missions_schedule_add = /** @type {(inputs: Missions_Schedule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une échéance`)
};

/**
* | output |
* | --- |
* | "Add an instalment" |
*
* @param {Missions_Schedule_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_add = /** @type {((inputs?: Missions_Schedule_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_add(inputs)
	return en_missions_schedule_add(inputs)
});
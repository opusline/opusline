/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_Unmark_ReadyInputs */

const en_missions_schedule_unmark_ready = /** @type {(inputs: Missions_Schedule_Unmark_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not ready yet`)
};

const fr_missions_schedule_unmark_ready = /** @type {(inputs: Missions_Schedule_Unmark_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore prête`)
};

/**
* | output |
* | --- |
* | "Not ready yet" |
*
* @param {Missions_Schedule_Unmark_ReadyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_unmark_ready = /** @type {((inputs?: Missions_Schedule_Unmark_ReadyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_Unmark_ReadyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_unmark_ready(inputs)
	return en_missions_schedule_unmark_ready(inputs)
});
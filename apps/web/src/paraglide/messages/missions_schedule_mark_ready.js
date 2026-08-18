/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_Mark_ReadyInputs */

const en_missions_schedule_mark_ready = /** @type {(inputs: Missions_Schedule_Mark_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark ready`)
};

const fr_missions_schedule_mark_ready = /** @type {(inputs: Missions_Schedule_Mark_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer prête`)
};

/**
* | output |
* | --- |
* | "Mark ready" |
*
* @param {Missions_Schedule_Mark_ReadyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_mark_ready = /** @type {((inputs?: Missions_Schedule_Mark_ReadyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_Mark_ReadyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_mark_ready(inputs)
	return en_missions_schedule_mark_ready(inputs)
});
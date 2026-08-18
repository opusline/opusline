/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_DeleteInputs */

const en_missions_schedule_delete = /** @type {(inputs: Missions_Schedule_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the instalment`)
};

const fr_missions_schedule_delete = /** @type {(inputs: Missions_Schedule_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer l’échéance`)
};

/**
* | output |
* | --- |
* | "Delete the instalment" |
*
* @param {Missions_Schedule_DeleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_delete = /** @type {((inputs?: Missions_Schedule_DeleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_DeleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_delete(inputs)
	return en_missions_schedule_delete(inputs)
});
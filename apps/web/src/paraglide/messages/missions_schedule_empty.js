/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_EmptyInputs */

const en_missions_schedule_empty = /** @type {(inputs: Missions_Schedule_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No schedule. This fixed price is billed whenever you invoice it.`)
};

const fr_missions_schedule_empty = /** @type {(inputs: Missions_Schedule_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas d’échéancier. Ce forfait se facture quand vous le décidez.`)
};

/**
* | output |
* | --- |
* | "No schedule. This fixed price is billed whenever you invoice it." |
*
* @param {Missions_Schedule_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_empty = /** @type {((inputs?: Missions_Schedule_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_empty(inputs)
	return en_missions_schedule_empty(inputs)
});
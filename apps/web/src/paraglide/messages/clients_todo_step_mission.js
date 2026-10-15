/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Todo_Step_MissionInputs */



/**
* | output |
* | --- |
* | "Attach a mission and its rate" |
*
* @param {Clients_Todo_Step_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_todo_step_mission = /** @type {((inputs?: Clients_Todo_Step_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Todo_Step_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Lui associer une mission et son tarif")
	return /** @type {LocalizedString} */ ("Attach a mission and its rate")
});
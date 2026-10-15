/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Add_MissionInputs */

const en_clients_add_mission = /** @type {(inputs: Clients_Add_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a mission`)
};

const fr_clients_add_mission = /** @type {(inputs: Clients_Add_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une mission`)
};

/**
* | output |
* | --- |
* | "Add a mission" |
*
* @param {Clients_Add_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_add_mission = /** @type {((inputs?: Clients_Add_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Add_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_add_mission(inputs)
	return en_clients_add_mission(inputs)
});
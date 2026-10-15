/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_MissionInputs */

const en_clients_create_mission = /** @type {(inputs: Clients_Create_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a mission`)
};

const fr_clients_create_mission = /** @type {(inputs: Clients_Create_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer une mission`)
};

/**
* | output |
* | --- |
* | "Create a mission" |
*
* @param {Clients_Create_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_create_mission = /** @type {((inputs?: Clients_Create_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Create_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_create_mission(inputs)
	return en_clients_create_mission(inputs)
});
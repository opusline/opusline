/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Head_MissionInputs */

const en_clients_head_mission = /** @type {(inputs: Clients_Head_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

const fr_clients_head_mission = /** @type {(inputs: Clients_Head_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission`)
};

/**
* | output |
* | --- |
* | "Mission" |
*
* @param {Clients_Head_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_head_mission = /** @type {((inputs?: Clients_Head_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Head_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_head_mission(inputs)
	return en_clients_head_mission(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_No_Mission_CreateInputs */

const en_clients_no_mission_create = /** @type {(inputs: Clients_No_Mission_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No missions — create one`)
};

const fr_clients_no_mission_create = /** @type {(inputs: Clients_No_Mission_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune mission — en créer une`)
};

/**
* | output |
* | --- |
* | "No missions — create one" |
*
* @param {Clients_No_Mission_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_no_mission_create = /** @type {((inputs?: Clients_No_Mission_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_No_Mission_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_no_mission_create(inputs)
	return en_clients_no_mission_create(inputs)
});
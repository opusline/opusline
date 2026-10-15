/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Missions_Empty_HintInputs */

const en_clients_missions_empty_hint = /** @type {(inputs: Clients_Missions_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This client has no active mission. Create one to track time on it.`)
};

const fr_clients_missions_empty_hint = /** @type {(inputs: Clients_Missions_Empty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce client n'a pas de mission active. Créez-en une pour pouvoir suivre du temps dessus.`)
};

/**
* | output |
* | --- |
* | "This client has no active mission. Create one to track time on it." |
*
* @param {Clients_Missions_Empty_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_missions_empty_hint = /** @type {((inputs?: Clients_Missions_Empty_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Missions_Empty_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_missions_empty_hint(inputs)
	return en_clients_missions_empty_hint(inputs)
});
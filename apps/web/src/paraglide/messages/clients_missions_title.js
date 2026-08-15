/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Missions_TitleInputs */

const en_clients_missions_title = /** @type {(inputs: Clients_Missions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missions`)
};

const fr_clients_missions_title = /** @type {(inputs: Clients_Missions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missions`)
};

/**
* | output |
* | --- |
* | "Missions" |
*
* @param {Clients_Missions_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_missions_title = /** @type {((inputs?: Clients_Missions_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Missions_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_missions_title(inputs)
	return en_clients_missions_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_No_MissionsInputs */

const en_clients_no_missions = /** @type {(inputs: Clients_No_MissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No missions`)
};

const fr_clients_no_missions = /** @type {(inputs: Clients_No_MissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune mission`)
};

/**
* | output |
* | --- |
* | "No missions" |
*
* @param {Clients_No_MissionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_no_missions = /** @type {((inputs?: Clients_No_MissionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_No_MissionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_no_missions(inputs)
	return en_clients_no_missions(inputs)
});
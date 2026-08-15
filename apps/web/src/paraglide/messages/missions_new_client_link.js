/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_New_Client_LinkInputs */

const en_missions_new_client_link = /** @type {(inputs: Missions_New_Client_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ New client`)
};

const fr_missions_new_client_link = /** @type {(inputs: Missions_New_Client_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ Nouveau client`)
};

/**
* | output |
* | --- |
* | "+ New client" |
*
* @param {Missions_New_Client_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_new_client_link = /** @type {((inputs?: Missions_New_Client_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_New_Client_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_new_client_link(inputs)
	return en_missions_new_client_link(inputs)
});
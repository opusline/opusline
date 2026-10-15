/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Select_ClientInputs */

const en_missions_select_client = /** @type {(inputs: Missions_Select_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select a client.`)
};

const fr_missions_select_client = /** @type {(inputs: Missions_Select_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sélectionnez un client.`)
};

/**
* | output |
* | --- |
* | "Select a client." |
*
* @param {Missions_Select_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_select_client = /** @type {((inputs?: Missions_Select_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Select_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_select_client(inputs)
	return en_missions_select_client(inputs)
});
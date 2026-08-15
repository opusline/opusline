/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Empty_Open_ClientsInputs */

const en_cra_empty_open_clients = /** @type {(inputs: Cra_Empty_Open_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open my clients`)
};

const fr_cra_empty_open_clients = /** @type {(inputs: Cra_Empty_Open_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir mes clients`)
};

/**
* | output |
* | --- |
* | "Open my clients" |
*
* @param {Cra_Empty_Open_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_empty_open_clients = /** @type {((inputs?: Cra_Empty_Open_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Empty_Open_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_empty_open_clients(inputs)
	return en_cra_empty_open_clients(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_ClientsInputs */

const en_nav_clients = /** @type {(inputs: Nav_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clients`)
};

const fr_nav_clients = /** @type {(inputs: Nav_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clients`)
};

/**
* | output |
* | --- |
* | "Clients" |
*
* @param {Nav_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_clients = /** @type {((inputs?: Nav_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_clients(inputs)
	return en_nav_clients(inputs)
});
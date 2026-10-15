/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_AriaInputs */

const en_clients_logo_aria = /** @type {(inputs: Clients_Logo_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client logo`)
};

const fr_clients_logo_aria = /** @type {(inputs: Clients_Logo_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo du client`)
};

/**
* | output |
* | --- |
* | "Client logo" |
*
* @param {Clients_Logo_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_aria = /** @type {((inputs?: Clients_Logo_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_aria(inputs)
	return en_clients_logo_aria(inputs)
});
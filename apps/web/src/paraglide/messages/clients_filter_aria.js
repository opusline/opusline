/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Filter_AriaInputs */

const en_clients_filter_aria = /** @type {(inputs: Clients_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter clients`)
};

const fr_clients_filter_aria = /** @type {(inputs: Clients_Filter_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtrer les clients`)
};

/**
* | output |
* | --- |
* | "Filter clients" |
*
* @param {Clients_Filter_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_filter_aria = /** @type {((inputs?: Clients_Filter_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Filter_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_filter_aria(inputs)
	return en_clients_filter_aria(inputs)
});
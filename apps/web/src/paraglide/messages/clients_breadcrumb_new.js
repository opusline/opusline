/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Breadcrumb_NewInputs */

const en_clients_breadcrumb_new = /** @type {(inputs: Clients_Breadcrumb_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New`)
};

const fr_clients_breadcrumb_new = /** @type {(inputs: Clients_Breadcrumb_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau`)
};

/**
* | output |
* | --- |
* | "New" |
*
* @param {Clients_Breadcrumb_NewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_breadcrumb_new = /** @type {((inputs?: Clients_Breadcrumb_NewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Breadcrumb_NewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_breadcrumb_new(inputs)
	return en_clients_breadcrumb_new(inputs)
});
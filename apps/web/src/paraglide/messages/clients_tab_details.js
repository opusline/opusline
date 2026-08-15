/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Tab_DetailsInputs */

const en_clients_tab_details = /** @type {(inputs: Clients_Tab_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contact details`)
};

const fr_clients_tab_details = /** @type {(inputs: Clients_Tab_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coordonnées`)
};

/**
* | output |
* | --- |
* | "Contact details" |
*
* @param {Clients_Tab_DetailsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_tab_details = /** @type {((inputs?: Clients_Tab_DetailsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Tab_DetailsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_tab_details(inputs)
	return en_clients_tab_details(inputs)
});
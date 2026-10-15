/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Details_Empty_TitleInputs */

const en_clients_details_empty_title = /** @type {(inputs: Clients_Details_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contact details to complete`)
};

const fr_clients_details_empty_title = /** @type {(inputs: Clients_Details_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coordonnées à compléter`)
};

/**
* | output |
* | --- |
* | "Contact details to complete" |
*
* @param {Clients_Details_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_details_empty_title = /** @type {((inputs?: Clients_Details_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Details_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_details_empty_title(inputs)
	return en_clients_details_empty_title(inputs)
});
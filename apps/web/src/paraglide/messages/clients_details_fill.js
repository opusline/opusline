/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Details_FillInputs */

const en_clients_details_fill = /** @type {(inputs: Clients_Details_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill in the details`)
};

const fr_clients_details_fill = /** @type {(inputs: Clients_Details_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renseigner les coordonnées`)
};

/**
* | output |
* | --- |
* | "Fill in the details" |
*
* @param {Clients_Details_FillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_details_fill = /** @type {((inputs?: Clients_Details_FillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Details_FillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_details_fill(inputs)
	return en_clients_details_fill(inputs)
});
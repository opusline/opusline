/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_DropInputs */

const en_clients_logo_drop = /** @type {(inputs: Clients_Logo_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop the logo`)
};

const fr_clients_logo_drop = /** @type {(inputs: Clients_Logo_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposez le logo`)
};

/**
* | output |
* | --- |
* | "Drop the logo" |
*
* @param {Clients_Logo_DropInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_drop = /** @type {((inputs?: Clients_Logo_DropInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_DropInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_drop(inputs)
	return en_clients_logo_drop(inputs)
});
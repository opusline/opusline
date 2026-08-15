/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_ShortInputs */

const en_clients_create_short = /** @type {(inputs: Clients_Create_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a client`)
};

const fr_clients_create_short = /** @type {(inputs: Clients_Create_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer un client`)
};

/**
* | output |
* | --- |
* | "Create a client" |
*
* @param {Clients_Create_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_create_short = /** @type {((inputs?: Clients_Create_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Create_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_create_short(inputs)
	return en_clients_create_short(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_DeleteInputs */

const en_clients_delete = /** @type {(inputs: Clients_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this client`)
};

const fr_clients_delete = /** @type {(inputs: Clients_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce client`)
};

/**
* | output |
* | --- |
* | "Delete this client" |
*
* @param {Clients_DeleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delete = /** @type {((inputs?: Clients_DeleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_DeleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delete(inputs)
	return en_clients_delete(inputs)
});
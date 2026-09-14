/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_DeletedInputs */

const en_clients_deleted = /** @type {(inputs: Clients_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client deleted`)
};

const fr_clients_deleted = /** @type {(inputs: Clients_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client supprimé`)
};

/**
* | output |
* | --- |
* | "Client deleted" |
*
* @param {Clients_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_deleted = /** @type {((inputs?: Clients_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_deleted(inputs)
	return en_clients_deleted(inputs)
});
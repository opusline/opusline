/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Delete_FailedInputs */

const en_clients_delete_failed = /** @type {(inputs: Clients_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client could not be deleted.`)
};

const fr_clients_delete_failed = /** @type {(inputs: Clients_Delete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le client n'a pas pu être supprimé.`)
};

/**
* | output |
* | --- |
* | "The client could not be deleted." |
*
* @param {Clients_Delete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delete_failed = /** @type {((inputs?: Clients_Delete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Delete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delete_failed(inputs)
	return en_clients_delete_failed(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Create_FailedInputs */

const en_clients_create_failed = /** @type {(inputs: Clients_Create_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client could not be created. Try again in a moment.`)
};

const fr_clients_create_failed = /** @type {(inputs: Clients_Create_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de créer le client. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The client could not be created. Try again in a moment." |
*
* @param {Clients_Create_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_create_failed = /** @type {((inputs?: Clients_Create_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Create_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_create_failed(inputs)
	return en_clients_create_failed(inputs)
});
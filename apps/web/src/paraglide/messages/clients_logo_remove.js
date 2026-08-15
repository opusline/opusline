/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_RemoveInputs */

const en_clients_logo_remove = /** @type {(inputs: Clients_Logo_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the client logo`)
};

const fr_clients_logo_remove = /** @type {(inputs: Clients_Logo_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer le logo du client`)
};

/**
* | output |
* | --- |
* | "Remove the client logo" |
*
* @param {Clients_Logo_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_remove = /** @type {((inputs?: Clients_Logo_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_remove(inputs)
	return en_clients_logo_remove(inputs)
});
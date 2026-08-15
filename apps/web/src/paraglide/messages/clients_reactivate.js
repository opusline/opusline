/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_ReactivateInputs */

const en_clients_reactivate = /** @type {(inputs: Clients_ReactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reactivate this client`)
};

const fr_clients_reactivate = /** @type {(inputs: Clients_ReactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réactiver ce client`)
};

/**
* | output |
* | --- |
* | "Reactivate this client" |
*
* @param {Clients_ReactivateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_reactivate = /** @type {((inputs?: Clients_ReactivateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_ReactivateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_reactivate(inputs)
	return en_clients_reactivate(inputs)
});
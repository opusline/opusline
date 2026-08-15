/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Empty_ScopeInputs */

const en_clients_empty_scope = /** @type {(inputs: Clients_Empty_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No clients in this view.`)
};

const fr_clients_empty_scope = /** @type {(inputs: Clients_Empty_ScopeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun client dans cette vue.`)
};

/**
* | output |
* | --- |
* | "No clients in this view." |
*
* @param {Clients_Empty_ScopeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_empty_scope = /** @type {((inputs?: Clients_Empty_ScopeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Empty_ScopeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_empty_scope(inputs)
	return en_clients_empty_scope(inputs)
});
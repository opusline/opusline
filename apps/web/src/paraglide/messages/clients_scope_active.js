/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Scope_ActiveInputs */

const en_clients_scope_active = /** @type {(inputs: Clients_Scope_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active`)
};

const fr_clients_scope_active = /** @type {(inputs: Clients_Scope_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actifs`)
};

/**
* | output |
* | --- |
* | "Active" |
*
* @param {Clients_Scope_ActiveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_scope_active = /** @type {((inputs?: Clients_Scope_ActiveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Scope_ActiveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_scope_active(inputs)
	return en_clients_scope_active(inputs)
});
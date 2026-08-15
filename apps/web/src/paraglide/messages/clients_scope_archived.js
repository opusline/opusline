/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Scope_ArchivedInputs */

const en_clients_scope_archived = /** @type {(inputs: Clients_Scope_ArchivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Archived`)
};

const fr_clients_scope_archived = /** @type {(inputs: Clients_Scope_ArchivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Archivés`)
};

/**
* | output |
* | --- |
* | "Archived" |
*
* @param {Clients_Scope_ArchivedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_scope_archived = /** @type {((inputs?: Clients_Scope_ArchivedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Scope_ArchivedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_scope_archived(inputs)
	return en_clients_scope_archived(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Badge_ArchivedInputs */

const en_clients_badge_archived = /** @type {(inputs: Clients_Badge_ArchivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Archived`)
};

const fr_clients_badge_archived = /** @type {(inputs: Clients_Badge_ArchivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Archivé`)
};

/**
* | output |
* | --- |
* | "Archived" |
*
* @param {Clients_Badge_ArchivedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_badge_archived = /** @type {((inputs?: Clients_Badge_ArchivedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Badge_ArchivedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_badge_archived(inputs)
	return en_clients_badge_archived(inputs)
});
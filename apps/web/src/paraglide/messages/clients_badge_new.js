/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Badge_NewInputs */

const en_clients_badge_new = /** @type {(inputs: Clients_Badge_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New`)
};

const fr_clients_badge_new = /** @type {(inputs: Clients_Badge_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau`)
};

/**
* | output |
* | --- |
* | "New" |
*
* @param {Clients_Badge_NewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_badge_new = /** @type {((inputs?: Clients_Badge_NewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Badge_NewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_badge_new(inputs)
	return en_clients_badge_new(inputs)
});
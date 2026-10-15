/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_Drop_ShortInputs */

const en_clients_logo_drop_short = /** @type {(inputs: Clients_Logo_Drop_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drop`)
};

const fr_clients_logo_drop_short = /** @type {(inputs: Clients_Logo_Drop_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déposez`)
};

/**
* | output |
* | --- |
* | "Drop" |
*
* @param {Clients_Logo_Drop_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_drop_short = /** @type {((inputs?: Clients_Logo_Drop_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_Drop_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_drop_short(inputs)
	return en_clients_logo_drop_short(inputs)
});
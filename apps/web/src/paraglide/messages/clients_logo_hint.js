/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_HintInputs */

const en_clients_logo_hint = /** @type {(inputs: Clients_Logo_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG or SVG, transparent background.`)
};

const fr_clients_logo_hint = /** @type {(inputs: Clients_Logo_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG ou SVG, fond transparent.`)
};

/**
* | output |
* | --- |
* | "PNG or SVG, transparent background." |
*
* @param {Clients_Logo_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_hint = /** @type {((inputs?: Clients_Logo_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_hint(inputs)
	return en_clients_logo_hint(inputs)
});
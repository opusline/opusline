/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Color_InheritedInputs */

const en_clients_color_inherited = /** @type {(inputs: Clients_Color_InheritedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`inherited by its missions`)
};

const fr_clients_color_inherited = /** @type {(inputs: Clients_Color_InheritedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`héritée par ses missions`)
};

/**
* | output |
* | --- |
* | "inherited by its missions" |
*
* @param {Clients_Color_InheritedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_color_inherited = /** @type {((inputs?: Clients_Color_InheritedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Color_InheritedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_color_inherited(inputs)
	return en_clients_color_inherited(inputs)
});
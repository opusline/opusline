/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Default_Color_LabelInputs */

const en_clients_default_color_label = /** @type {(inputs: Clients_Default_Color_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default color`)
};

const fr_clients_default_color_label = /** @type {(inputs: Clients_Default_Color_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couleur par défaut`)
};

/**
* | output |
* | --- |
* | "Default color" |
*
* @param {Clients_Default_Color_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_default_color_label = /** @type {((inputs?: Clients_Default_Color_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Default_Color_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_default_color_label(inputs)
	return en_clients_default_color_label(inputs)
});
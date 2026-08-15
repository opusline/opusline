/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_LabelInputs */

const en_clients_logo_label = /** @type {(inputs: Clients_Logo_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo`)
};

const fr_clients_logo_label = /** @type {(inputs: Clients_Logo_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo`)
};

/**
* | output |
* | --- |
* | "Logo" |
*
* @param {Clients_Logo_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_label = /** @type {((inputs?: Clients_Logo_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_label(inputs)
	return en_clients_logo_label(inputs)
});
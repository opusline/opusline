/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Preview_Name_PlaceholderInputs */

const en_clients_preview_name_placeholder = /** @type {(inputs: Clients_Preview_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client name`)
};

const fr_clients_preview_name_placeholder = /** @type {(inputs: Clients_Preview_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom du client`)
};

/**
* | output |
* | --- |
* | "Client name" |
*
* @param {Clients_Preview_Name_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_preview_name_placeholder = /** @type {((inputs?: Clients_Preview_Name_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Preview_Name_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_preview_name_placeholder(inputs)
	return en_clients_preview_name_placeholder(inputs)
});
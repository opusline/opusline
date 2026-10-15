/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Preview_TitleInputs */

const en_clients_preview_title = /** @type {(inputs: Clients_Preview_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preview in the list`)
};

const fr_clients_preview_title = /** @type {(inputs: Clients_Preview_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu dans la liste`)
};

/**
* | output |
* | --- |
* | "Preview in the list" |
*
* @param {Clients_Preview_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_preview_title = /** @type {((inputs?: Clients_Preview_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Preview_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_preview_title(inputs)
	return en_clients_preview_title(inputs)
});
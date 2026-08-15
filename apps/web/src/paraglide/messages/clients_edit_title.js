/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Edit_TitleInputs */

const en_clients_edit_title = /** @type {(inputs: Clients_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the client`)
};

const fr_clients_edit_title = /** @type {(inputs: Clients_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le client`)
};

/**
* | output |
* | --- |
* | "Edit the client" |
*
* @param {Clients_Edit_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_edit_title = /** @type {((inputs?: Clients_Edit_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Edit_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_edit_title(inputs)
	return en_clients_edit_title(inputs)
});
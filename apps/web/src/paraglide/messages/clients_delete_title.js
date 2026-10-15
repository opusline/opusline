/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Delete_TitleInputs */

const en_clients_delete_title = /** @type {(inputs: Clients_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this client?`)
};

const fr_clients_delete_title = /** @type {(inputs: Clients_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer ce client ?`)
};

/**
* | output |
* | --- |
* | "Delete this client?" |
*
* @param {Clients_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delete_title = /** @type {((inputs?: Clients_Delete_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Delete_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delete_title(inputs)
	return en_clients_delete_title(inputs)
});
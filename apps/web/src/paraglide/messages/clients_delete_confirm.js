/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Delete_ConfirmInputs */

const en_clients_delete_confirm = /** @type {(inputs: Clients_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the client`)
};

const fr_clients_delete_confirm = /** @type {(inputs: Clients_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer le client`)
};

/**
* | output |
* | --- |
* | "Delete the client" |
*
* @param {Clients_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delete_confirm = /** @type {((inputs?: Clients_Delete_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Delete_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delete_confirm(inputs)
	return en_clients_delete_confirm(inputs)
});
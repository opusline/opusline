/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Clients_Delete_BodyInputs */

const en_clients_delete_body = /** @type {(inputs: Clients_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} will be removed for good, along with its logo and documents.`)
};

const fr_clients_delete_body = /** @type {(inputs: Clients_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} sera supprimé définitivement, avec son logo et ses documents.`)
};

/**
* | output |
* | --- |
* | "{name} will be removed for good, along with its logo and documents." |
*
* @param {Clients_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delete_body = /** @type {((inputs: Clients_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delete_body(inputs)
	return en_clients_delete_body(inputs)
});
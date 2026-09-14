/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Missions_Delete_BodyInputs */

const en_missions_delete_body = /** @type {(inputs: Missions_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} will be removed for good, along with its documents.`)
};

const fr_missions_delete_body = /** @type {(inputs: Missions_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} sera supprimée définitivement, avec ses documents.`)
};

/**
* | output |
* | --- |
* | "{name} will be removed for good, along with its documents." |
*
* @param {Missions_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_delete_body = /** @type {((inputs: Missions_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_delete_body(inputs)
	return en_missions_delete_body(inputs)
});
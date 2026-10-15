/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_DeleteInputs */

const en_missions_delete = /** @type {(inputs: Missions_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this mission`)
};

const fr_missions_delete = /** @type {(inputs: Missions_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette mission`)
};

/**
* | output |
* | --- |
* | "Delete this mission" |
*
* @param {Missions_DeleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_delete = /** @type {((inputs?: Missions_DeleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_DeleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_delete(inputs)
	return en_missions_delete(inputs)
});
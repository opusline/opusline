/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Delete_TitleInputs */

const en_missions_delete_title = /** @type {(inputs: Missions_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this mission?`)
};

const fr_missions_delete_title = /** @type {(inputs: Missions_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette mission ?`)
};

/**
* | output |
* | --- |
* | "Delete this mission?" |
*
* @param {Missions_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_delete_title = /** @type {((inputs?: Missions_Delete_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Delete_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_delete_title(inputs)
	return en_missions_delete_title(inputs)
});
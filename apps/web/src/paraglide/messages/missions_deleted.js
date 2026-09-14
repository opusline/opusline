/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_DeletedInputs */

const en_missions_deleted = /** @type {(inputs: Missions_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission deleted`)
};

const fr_missions_deleted = /** @type {(inputs: Missions_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission supprimée`)
};

/**
* | output |
* | --- |
* | "Mission deleted" |
*
* @param {Missions_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_deleted = /** @type {((inputs?: Missions_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_deleted(inputs)
	return en_missions_deleted(inputs)
});
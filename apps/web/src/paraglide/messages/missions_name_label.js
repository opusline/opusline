/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Name_LabelInputs */

const en_missions_name_label = /** @type {(inputs: Missions_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission name`)
};

const fr_missions_name_label = /** @type {(inputs: Missions_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom de la mission`)
};

/**
* | output |
* | --- |
* | "Mission name" |
*
* @param {Missions_Name_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_name_label = /** @type {((inputs?: Missions_Name_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Name_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_name_label(inputs)
	return en_missions_name_label(inputs)
});
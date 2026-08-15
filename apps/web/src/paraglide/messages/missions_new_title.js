/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_New_TitleInputs */

const en_missions_new_title = /** @type {(inputs: Missions_New_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New mission`)
};

const fr_missions_new_title = /** @type {(inputs: Missions_New_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouvelle mission`)
};

/**
* | output |
* | --- |
* | "New mission" |
*
* @param {Missions_New_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_new_title = /** @type {((inputs?: Missions_New_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_New_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_new_title(inputs)
	return en_missions_new_title(inputs)
});
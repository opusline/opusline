/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Edit_TitleInputs */

const en_missions_edit_title = /** @type {(inputs: Missions_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the mission`)
};

const fr_missions_edit_title = /** @type {(inputs: Missions_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier la mission`)
};

/**
* | output |
* | --- |
* | "Edit the mission" |
*
* @param {Missions_Edit_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_edit_title = /** @type {((inputs?: Missions_Edit_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Edit_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_edit_title(inputs)
	return en_missions_edit_title(inputs)
});
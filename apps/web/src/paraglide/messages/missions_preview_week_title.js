/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Week_TitleInputs */

const en_missions_preview_week_title = /** @type {(inputs: Missions_Preview_Week_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preview in the week`)
};

const fr_missions_preview_week_title = /** @type {(inputs: Missions_Preview_Week_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu dans la semaine`)
};

/**
* | output |
* | --- |
* | "Preview in the week" |
*
* @param {Missions_Preview_Week_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_week_title = /** @type {((inputs?: Missions_Preview_Week_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Week_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_week_title(inputs)
	return en_missions_preview_week_title(inputs)
});
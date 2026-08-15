/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Monthly_TitleInputs */

const en_missions_preview_monthly_title = /** @type {(inputs: Missions_Preview_Monthly_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly projection`)
};

const fr_missions_preview_monthly_title = /** @type {(inputs: Missions_Preview_Monthly_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projection mensuelle`)
};

/**
* | output |
* | --- |
* | "Monthly projection" |
*
* @param {Missions_Preview_Monthly_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_monthly_title = /** @type {((inputs?: Missions_Preview_Monthly_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Monthly_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_monthly_title(inputs)
	return en_missions_preview_monthly_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_MondayInputs */

const en_missions_preview_monday = /** @type {(inputs: Missions_Preview_MondayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mon`)
};

const fr_missions_preview_monday = /** @type {(inputs: Missions_Preview_MondayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lun`)
};

/**
* | output |
* | --- |
* | "Mon" |
*
* @param {Missions_Preview_MondayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_monday = /** @type {((inputs?: Missions_Preview_MondayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_MondayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_monday(inputs)
	return en_missions_preview_monday(inputs)
});
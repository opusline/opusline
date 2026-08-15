/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Amount_TitleInputs */

const en_missions_preview_amount_title = /** @type {(inputs: Missions_Preview_Amount_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission amount`)
};

const fr_missions_preview_amount_title = /** @type {(inputs: Missions_Preview_Amount_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant de la mission`)
};

/**
* | output |
* | --- |
* | "Mission amount" |
*
* @param {Missions_Preview_Amount_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_amount_title = /** @type {((inputs?: Missions_Preview_Amount_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Amount_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_amount_title(inputs)
	return en_missions_preview_amount_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Cra_TitleInputs */

const en_missions_cra_title = /** @type {(inputs: Missions_Cra_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity reports (CRA)`)
};

const fr_missions_cra_title = /** @type {(inputs: Missions_Cra_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Comptes rendus d'activité`)
};

/**
* | output |
* | --- |
* | "Activity reports (CRA)" |
*
* @param {Missions_Cra_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_cra_title = /** @type {((inputs?: Missions_Cra_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Cra_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_cra_title(inputs)
	return en_missions_cra_title(inputs)
});
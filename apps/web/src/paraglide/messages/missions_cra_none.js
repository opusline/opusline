/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Cra_NoneInputs */

const en_missions_cra_none = /** @type {(inputs: Missions_Cra_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No month to report yet. A month appears here as soon as it has tracked time, and the current one as soon as the mission is active.`)
};

const fr_missions_cra_none = /** @type {(inputs: Missions_Cra_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun mois à reporter pour l'instant. Un mois apparaît ici dès qu'il porte du temps suivi, et le mois en cours dès que la mission est active.`)
};

/**
* | output |
* | --- |
* | "No month to report yet. A month appears here as soon as it has tracked time, and the current one as soon as the mission is active." |
*
* @param {Missions_Cra_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_cra_none = /** @type {((inputs?: Missions_Cra_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Cra_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_cra_none(inputs)
	return en_missions_cra_none(inputs)
});
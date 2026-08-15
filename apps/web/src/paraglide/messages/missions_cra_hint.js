/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Cra_HintInputs */

const en_missions_cra_hint = /** @type {(inputs: Missions_Cra_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This client expects a monthly CRA. This mission's months stack up on the dedicated screen, with their grid and document.`)
};

const fr_missions_cra_hint = /** @type {(inputs: Missions_Cra_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce client attend un CRA mensuel. Les mois de cette mission s'empilent sur l'écran dédié, avec leur grille et leur document.`)
};

/**
* | output |
* | --- |
* | "This client expects a monthly CRA. This mission's months stack up on the dedicated screen, with their grid and document." |
*
* @param {Missions_Cra_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_cra_hint = /** @type {((inputs?: Missions_Cra_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Cra_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_cra_hint(inputs)
	return en_missions_cra_hint(inputs)
});
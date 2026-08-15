/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Workday_HintInputs */

const en_settings_workday_hint = /** @type {(inputs: Settings_Workday_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Converts tracked time into day fractions on TJM missions. The change also applies to history already tracked.`)
};

const fr_settings_workday_hint = /** @type {(inputs: Settings_Workday_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Convertit le temps suivi en fractions de journée sur les missions au TJM. Le changement s'applique aussi à l'historique déjà saisi.`)
};

/**
* | output |
* | --- |
* | "Converts tracked time into day fractions on TJM missions. The change also applies to history already tracked." |
*
* @param {Settings_Workday_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_workday_hint = /** @type {((inputs?: Settings_Workday_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Workday_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_workday_hint(inputs)
	return en_settings_workday_hint(inputs)
});
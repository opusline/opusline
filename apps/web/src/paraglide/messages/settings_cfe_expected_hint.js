/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Cfe_Expected_HintInputs */

const en_settings_cfe_expected_hint = /** @type {(inputs: Settings_Cfe_Expected_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your commune sets it — take last year's notice. Without it, Opusline estimates from last year's bank payment, or failing that from the statutory barème and your revenue; entering it overrides the estimate and feeds the treasury provision.`)
};

const fr_settings_cfe_expected_hint = /** @type {(inputs: Settings_Cfe_Expected_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre commune la fixe : reprenez l'avis de l'an dernier. Sans montant, Opusline estime d'après le prélèvement de l'an dernier, sinon d'après le barème légal et votre chiffre d'affaires ; le renseigner corrige l'estimation et alimente la provision de trésorerie.`)
};

/**
* | output |
* | --- |
* | "Your commune sets it — take last year's notice. Without it, Opusline estimates from last year's bank payment, or failing that from the statutory barème and y..." |
*
* @param {Settings_Cfe_Expected_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_cfe_expected_hint = /** @type {((inputs?: Settings_Cfe_Expected_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Cfe_Expected_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_cfe_expected_hint(inputs)
	return en_settings_cfe_expected_hint(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Missions_Cra_Required_HintInputs */

const en_missions_cra_required_hint = /** @type {(inputs: Missions_Cra_Required_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Required by ${i?.client} at the end of the month · pre-filled PDF export.`)
};

const fr_missions_cra_required_hint = /** @type {(inputs: Missions_Cra_Required_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Exigé par ${i?.client} en fin de mois · export PDF pré-rempli.`)
};

/**
* | output |
* | --- |
* | "Required by {client} at the end of the month · pre-filled PDF export." |
*
* @param {Missions_Cra_Required_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_cra_required_hint = /** @type {((inputs: Missions_Cra_Required_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Cra_Required_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_cra_required_hint(inputs)
	return en_missions_cra_required_hint(inputs)
});
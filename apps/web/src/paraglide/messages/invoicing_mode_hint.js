/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_HintInputs */

const en_invoicing_mode_hint = /** @type {(inputs: Invoicing_Mode_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It is what the Create button does by default. The other stays available case by case, in its menu.`)
};

const fr_invoicing_mode_hint = /** @type {(inputs: Invoicing_Mode_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`C'est l'action par défaut du bouton Créer. L'autre reste disponible au cas par cas, dans son menu.`)
};

/**
* | output |
* | --- |
* | "It is what the Create button does by default. The other stays available case by case, in its menu." |
*
* @param {Invoicing_Mode_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_hint = /** @type {((inputs?: Invoicing_Mode_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_hint(inputs)
	return en_invoicing_mode_hint(inputs)
});
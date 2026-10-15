/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_HintInputs */



/**
* | output |
* | --- |
* | "Something broke while showing this page. Trying again usually helps; if not, head back to the dashboard." |
*
* @param {Error_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const error_hint = /** @type {((inputs?: Error_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Une erreur est survenue en affichant cette page. Réessayer suffit souvent ; sinon, retournez au tableau de bord.")
	return /** @type {LocalizedString} */ ("Something broke while showing this page. Trying again usually helps; if not, head back to the dashboard.")
});
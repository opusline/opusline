/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Signed_Return_TitleInputs */

const en_cra_signed_return_title = /** @type {(inputs: Cra_Signed_Return_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record the signed return`)
};

const fr_cra_signed_return_title = /** @type {(inputs: Cra_Signed_Return_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer le retour signé`)
};

/**
* | output |
* | --- |
* | "Record the signed return" |
*
* @param {Cra_Signed_Return_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_signed_return_title = /** @type {((inputs?: Cra_Signed_Return_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Signed_Return_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_signed_return_title(inputs)
	return en_cra_signed_return_title(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Signed_Return_HintInputs */

const en_cra_signed_return_hint = /** @type {(inputs: Cra_Signed_Return_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF, JPG or PNG — drag the file or click to browse`)
};

const fr_cra_signed_return_hint = /** @type {(inputs: Cra_Signed_Return_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PDF, JPG ou PNG — glissez le fichier ou cliquez pour parcourir`)
};

/**
* | output |
* | --- |
* | "PDF, JPG or PNG — drag the file or click to browse" |
*
* @param {Cra_Signed_Return_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_signed_return_hint = /** @type {((inputs?: Cra_Signed_Return_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Signed_Return_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_signed_return_hint(inputs)
	return en_cra_signed_return_hint(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, mission: NonNullable<unknown> }} Cra_Signed_Return_DescriptionInputs */

const en_cra_signed_return_description = /** @type {(inputs: Cra_Signed_Return_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CRA for ${i?.month} · ${i?.mission}. The document joins the mission's files next to the original.`)
};

const fr_cra_signed_return_description = /** @type {(inputs: Cra_Signed_Return_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CRA de ${i?.month} · ${i?.mission}. Le document rejoint les pièces de la mission à côté de l'original.`)
};

/**
* | output |
* | --- |
* | "CRA for {month} · {mission}. The document joins the mission's files next to the original." |
*
* @param {Cra_Signed_Return_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_signed_return_description = /** @type {((inputs: Cra_Signed_Return_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Signed_Return_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_signed_return_description(inputs)
	return en_cra_signed_return_description(inputs)
});
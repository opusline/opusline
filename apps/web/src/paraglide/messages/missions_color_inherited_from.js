/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Missions_Color_Inherited_FromInputs */

const en_missions_color_inherited_from = /** @type {(inputs: Missions_Color_Inherited_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`inherited from ${i?.client}`)
};

const fr_missions_color_inherited_from = /** @type {(inputs: Missions_Color_Inherited_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`héritée de ${i?.client}`)
};

/**
* | output |
* | --- |
* | "inherited from {client}" |
*
* @param {Missions_Color_Inherited_FromInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_color_inherited_from = /** @type {((inputs: Missions_Color_Inherited_FromInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Color_Inherited_FromInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_color_inherited_from(inputs)
	return en_missions_color_inherited_from(inputs)
});
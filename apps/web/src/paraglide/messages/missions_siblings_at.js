/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Missions_Siblings_AtInputs */

const en_missions_siblings_at = /** @type {(inputs: Missions_Siblings_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Missions at ${i?.client}:`)
};

const fr_missions_siblings_at = /** @type {(inputs: Missions_Siblings_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Missions chez ${i?.client} :`)
};

/**
* | output |
* | --- |
* | "Missions at {client}:" |
*
* @param {Missions_Siblings_AtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_siblings_at = /** @type {((inputs: Missions_Siblings_AtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Siblings_AtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_siblings_at(inputs)
	return en_missions_siblings_at(inputs)
});
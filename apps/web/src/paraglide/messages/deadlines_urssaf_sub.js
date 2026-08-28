/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, rate: NonNullable<unknown> }} Deadlines_Urssaf_SubInputs */

const en_deadlines_urssaf_sub = /** @type {(inputs: Deadlines_Urssaf_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Declare ${i?.amount} collected → contributions at ${i?.rate} %`)
};

const fr_deadlines_urssaf_sub = /** @type {(inputs: Deadlines_Urssaf_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Déclarer ${i?.amount} encaissés → cotisations à ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "Declare {amount} collected → contributions at {rate} %" |
*
* @param {Deadlines_Urssaf_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_urssaf_sub = /** @type {((inputs: Deadlines_Urssaf_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Urssaf_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_urssaf_sub(inputs)
	return en_deadlines_urssaf_sub(inputs)
});
/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ client: NonNullable<unknown> }} Missions_End_Client_Billed_ViaInputs */

const en_missions_end_client_billed_via = /** @type {(inputs: Missions_End_Client_Billed_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(billed through ${i?.client})`)
};

const fr_missions_end_client_billed_via = /** @type {(inputs: Missions_End_Client_Billed_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(facturé par ${i?.client})`)
};

/**
* | output |
* | --- |
* | "(billed through {client})" |
*
* @param {Missions_End_Client_Billed_ViaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_end_client_billed_via = /** @type {((inputs: Missions_End_Client_Billed_ViaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_End_Client_Billed_ViaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_end_client_billed_via(inputs)
	return en_missions_end_client_billed_via(inputs)
});
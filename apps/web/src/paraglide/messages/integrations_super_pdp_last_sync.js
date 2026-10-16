/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Integrations_Super_Pdp_Last_SyncInputs */

const en_integrations_super_pdp_last_sync = /** @type {(inputs: Integrations_Super_Pdp_Last_SyncInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Inbox last read on ${i?.date}.`)
};

const fr_integrations_super_pdp_last_sync = /** @type {(inputs: Integrations_Super_Pdp_Last_SyncInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Boîte de réception lue le ${i?.date}.`)
};

/**
* | output |
* | --- |
* | "Inbox last read on {date}." |
*
* @param {Integrations_Super_Pdp_Last_SyncInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_super_pdp_last_sync = /** @type {((inputs: Integrations_Super_Pdp_Last_SyncInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Super_Pdp_Last_SyncInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_super_pdp_last_sync(inputs)
	return en_integrations_super_pdp_last_sync(inputs)
});
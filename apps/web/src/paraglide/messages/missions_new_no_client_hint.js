/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_New_No_Client_HintInputs */



/**
* | output |
* | --- |
* | "A mission belongs to a client. Create an active client first." |
*
* @param {Missions_New_No_Client_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_new_no_client_hint = /** @type {((inputs?: Missions_New_No_Client_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_New_No_Client_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Une mission appartient à un client. Créez d'abord un client actif.")
	return /** @type {LocalizedString} */ ("A mission belongs to a client. Create an active client first.")
});
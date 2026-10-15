/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Preview_Urssaf_ProvisionInputs */

const en_missions_preview_urssaf_provision = /** @type {(inputs: Missions_Preview_Urssaf_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF provision · 26%`)
};

const fr_missions_preview_urssaf_provision = /** @type {(inputs: Missions_Preview_Urssaf_ProvisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision URSSAF · 26 %`)
};

/**
* | output |
* | --- |
* | "URSSAF provision · 26%" |
*
* @param {Missions_Preview_Urssaf_ProvisionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_preview_urssaf_provision = /** @type {((inputs?: Missions_Preview_Urssaf_ProvisionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Preview_Urssaf_ProvisionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_preview_urssaf_provision(inputs)
	return en_missions_preview_urssaf_provision(inputs)
});
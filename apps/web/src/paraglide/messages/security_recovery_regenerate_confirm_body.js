/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_Regenerate_Confirm_BodyInputs */



/**
* | output |
* | --- |
* | "The current codes stop working. Note the new ones as soon as they show." |
*
* @param {Security_Recovery_Regenerate_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_regenerate_confirm_body = /** @type {((inputs?: Security_Recovery_Regenerate_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_Regenerate_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Les codes actuels cesseront de fonctionner. Notez les nouveaux dès qu'ils s'affichent.")
	return /** @type {LocalizedString} */ ("The current codes stop working. Note the new ones as soon as they show.")
});
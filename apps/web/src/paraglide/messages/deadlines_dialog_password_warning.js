/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_Password_WarningInputs */



/**
* | output |
* | --- |
* | "Treat it like a password: whoever holds it can read your deadlines. Regenerate it if it has been passed around." |
*
* @param {Deadlines_Dialog_Password_WarningInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_password_warning = /** @type {((inputs?: Deadlines_Dialog_Password_WarningInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_Password_WarningInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Traitez-la comme un mot de passe : qui la détient peut lire vos échéances. Régénérez-la si elle a circulé.")
	return /** @type {LocalizedString} */ ("Treat it like a password: whoever holds it can read your deadlines. Regenerate it if it has been passed around.")
});
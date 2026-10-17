/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_SubtitleInputs */

const en_emails_subtitle = /** @type {(inputs: Emails_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The messages that go with your documents. The words between braces are filled in when sending, and each message can still be edited right before it leaves.`)
};

const fr_emails_subtitle = /** @type {(inputs: Emails_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les messages qui accompagnent vos documents. Les mots entre accolades sont remplacés à l'envoi, et chaque message reste modifiable juste avant de partir.`)
};

/**
* | output |
* | --- |
* | "The messages that go with your documents. The words between braces are filled in when sending, and each message can still be edited right before it leaves." |
*
* @param {Emails_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_subtitle = /** @type {((inputs?: Emails_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_subtitle(inputs)
	return en_emails_subtitle(inputs)
});
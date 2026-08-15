/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Release_Notes_Unread_TitleInputs */

const en_release_notes_unread_title = /** @type {(inputs: Release_Notes_Unread_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} new release since your last visit`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} new releases since your last visit`);
	return /** @type {LocalizedString} */ ("release_notes_unread_title");
};

const fr_release_notes_unread_title = /** @type {(inputs: Release_Notes_Unread_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} nouvelle version depuis votre dernière visite`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} nouvelles versions depuis votre dernière visite`);
	return /** @type {LocalizedString} */ ("release_notes_unread_title");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} new release since your last visit" |
* | "other" | "{count} new releases since your last visit" |
*
* @param {Release_Notes_Unread_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_unread_title = /** @type {((inputs: Release_Notes_Unread_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Unread_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_unread_title(inputs)
	return en_release_notes_unread_title(inputs)
});
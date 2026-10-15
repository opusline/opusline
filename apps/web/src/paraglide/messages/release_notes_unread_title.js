/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Release_Notes_Unread_TitleInputs */

const en_release_notes_unread_title = /** @type {(inputs: Release_Notes_Unread_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} release note you haven't read`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} release notes you haven't read`);
	return /** @type {LocalizedString} */ ("release_notes_unread_title");
};

const fr_release_notes_unread_title = /** @type {(inputs: Release_Notes_Unread_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} note de version que vous n'avez pas lue`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} notes de version que vous n'avez pas lues`);
	return /** @type {LocalizedString} */ ("release_notes_unread_title");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} release note you haven't read" |
* | "other" | "{count} release notes you haven't read" |
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
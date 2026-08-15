/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Release_Notes_Unread_CountInputs */

const en_release_notes_unread_count = /** @type {(inputs: Release_Notes_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} unread release note`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} unread release notes`);
	return /** @type {LocalizedString} */ ("release_notes_unread_count");
};

const fr_release_notes_unread_count = /** @type {(inputs: Release_Notes_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} note de version non lue`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} notes de version non lues`);
	return /** @type {LocalizedString} */ ("release_notes_unread_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} unread release note" |
* | "other" | "{count} unread release notes" |
*
* @param {Release_Notes_Unread_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_unread_count = /** @type {((inputs: Release_Notes_Unread_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Unread_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_unread_count(inputs)
	return en_release_notes_unread_count(inputs)
});
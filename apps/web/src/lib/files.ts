/**
 * One dropzone gate for every upload surface: extension first, size second,
 * null when the file is acceptable. Reasons come in as thunks so each surface
 * words (and translates) its own rejection.
 */
export function fileRejector(options: {
  accept: string;
  maxBytes: number;
  rejectType: () => string;
  rejectSize: () => string;
}): (file: File) => string | null {
  const acceptedExtensions = new Set(
    options.accept.split(",").map((extension) => extension.slice(1)),
  );

  return (file: File): string | null => {
    const extension = file.name.toLowerCase().split(".").pop() ?? "";

    if (!acceptedExtensions.has(extension)) {
      return options.rejectType();
    }

    if (file.size > options.maxBytes) {
      return options.rejectSize();
    }

    return null;
  };
}

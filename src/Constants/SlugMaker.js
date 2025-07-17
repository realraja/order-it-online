import slugify from "slugify";

export const getSlugFromName = (name) => {
  if (!name || typeof name !== "string") return "";
  return slugify(name, {
    lower: true,        // lowercase result
    strict: true,       // remove special characters
    trim: true,         // trim surrounding whitespace
  });
};

// this is not mongoose Schema, this will occur even
// before we attempt to save the data
// cause mongoose errors are BIG
// overwriting the mongoose errors
// faster then mongoose
// checking even before saving to mongoose db
const BaseJoi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const SanitizeHtml = require("sanitize-html");


// for defining own properties which then can apply similar to .min()
const Joi = BaseJoi.extend((joi) => {
  return {
    type: "string",
    base: joi.string(),
    messages:{
      'string.htmlStrip':'{{#label} must not include HTML!}'
    },
    rules: {
      htmlStrip: {
        validate(value,helpers) {
          const clean=SanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
          if(clean!==value){
            return helpers.error('string.htmlStrip',{value});
          }
          return clean;
        },
      },
    },
  };
});

// for joi password validation
const joiPassword = Joi.extend(joiPasswordExtendCore);

// Joi Validation Schema for campgrounds
const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().htmlStrip(),
    price: Joi.number().required().min(1),
    location: Joi.string().required().htmlStrip(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

// Joi Validation Schema for reviews
// will trigger the validation before saving to db
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required().htmlStrip(),
  }).required(),
});

const userSchema = Joi.object({
  username: Joi.string().min(5).max(200).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required(),
});

module.exports = {
  campgroundSchema,
  reviewSchema,
  userSchema,
};

const validator = require('validator')
const is_empty = require('../utils/is_empty')

module.exports = function validate_input_for_presentation(input) {
   let errors = {}

   // These have an order and will overwrite each other

   if (input.title && !validator.isLength(String(input.title), { max: 80 })) {
      errors.title =
         'The title of your presentation can be no longer than 80 characters. Brevity is the soul of wit!'
   }
   if (input.title && validator.matches(String(input.title), /-\d+\s*$/)) {
      errors.title =
         'Hey, I know this is weird. But your title cannot end with a dash followed by a number.'
   }
   if (input.video_url && !validator.isURL(String(input.video_url))) {
      errors.video_url = 'video_url is not a valid URL.'
   }
   if (
      input.video_screenshot_url &&
      !validator.isURL(String(input.video_screenshot_url))
   ) {
      errors.video_screenshot_url = 'video_screenshot_url is not a valid URL.'
   }
   if (
      input.video_screenshot_with_play_url &&
      !validator.isURL(String(input.video_screenshot_with_play_url))
   ) {
      errors.video_screenshot_url =
         'video_screenshot_with_play_url is not a valid URL.'
   }
   if (
      input.signed_up_on &&
      !validator.isISO8601(String(input.signed_up_on), { strict: true })
   ) {
      errors.signed_up_on = 'signed_up_on is not a valid date.'
   }
   if (input.is_active && !validator.isBoolean(String(input.is_active))) {
      errors.is_active = 'is_active must be a Boolean.'
   }
   if (input.is_featured && !validator.isBoolean(String(input.is_featured))) {
      errors.is_featured = 'is_featured must be a Boolean.'
   }
   if (
      input.has_accepted_agreement &&
      !validator.isBoolean(String(input.has_accepted_agreement))
   ) {
      errors.has_accepted_agreement =
         'has_accepted_agreement must be a Boolean.'
   }
   if (input.order && !validator.isNumeric(String(input.order))) {
      errors.order = 'order must be a number.'
   }

   // required fields
   if (is_empty(input.title)) errors.title = 'title is required'
   if (is_empty(input.order)) errors.order = 'order is required'
   if (is_empty(input.has_accepted_agreement))
      errors.has_accepted_agreement = 'has_accepted_agreement is required'

   return {
      errors, // the errors obj
      is_valid: is_empty(errors), // returns true if the errors obj is empty
   }
}

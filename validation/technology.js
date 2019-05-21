const validator = require('validator')
const is_empty = require('../utils/is_empty')

module.exports = function validate_input_for_technology(input) {
   let errors = {}

   // if the user input is empty, replace with an empty string
   // else use the user's input
   input.name = is_empty(input.name) ? '' : input.name

   // These have an order! E.g. the isEmpty validation will overwrite the isEmail validation.
   if (validator.isEmpty(input.name)) {
      errors.name = 'A name for the technology is required.'
   }

   console.log({ errors, is_valid: is_empty(errors) })

   return {
      errors, // the errors obj
      is_valid: is_empty(errors), // returns true if the errors obj is empty
   }
}

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const technology_model = require('../../../models/technology')
const create_row_id = require('../../../utils/create_row_id')
const validate_input_for_technology = require('../../../validation/technology')

// @route      GET api/v1/technologies
// @desc       Gets all technologies
// @access     Public
router.get('/', (req, res) => {
   technology_model
      .find()
      .then(technologies => {
         res.json(technologies)
      })
      .catch(err => console.log(err))
})

// @route      POST api/v1/technologies
// @desc       Create a new technology in the technologies resource
// @access     Public
router.post('/', (req, res) => {
   const body = req.body
   // Validate user input
   const { errors, is_valid } = validate_input_for_agreement(body)
   if (!is_valid) {
      return res.status(400).json(errors)
   }

   const agreement_obj = {}
   // These are fields that can be updated via the API
   if (body.title) agreement_obj.title = body.title // String, required
   if (body.version) agreement_obj.version = body.version // Number, required
   if (body.text) agreement_obj.text = body.text // String, required
   if (body.created_on) agreement_obj.created_on = body.created_on // Date, default Date.now()
   if (body.is_active) agreement_obj.is_active = body.is_active // Boolean, default true

   agreement_model
      .findById(body._id)
      .then(async agreement => {
         if (agreement) {
            // if we include an id in the request and it matches a document, update
            agreement_model
               .findByIdAndUpdate(
                  body._id,
                  { $set: agreement_obj },
                  { new: true }
               )
               .then(updated_agreement => res.json(updated_agreement))
               .catch(err => res.status(400).json(err))
         } else {
            // Create agreement
            agreement_obj.row_id = await create_row_id(agreement_model)

            new agreement_model(agreement_obj)
               .save()
               .then(agreement => {
                  res.json(agreement)
               })
               .catch(err => res.status(400).json(err))
         }
      })
      .catch(err => res.status(400).json(err))
})

const example_api_return = {
   _id: mongoose.Schema.Types.ObjectId,
   row_id: Number,
   name: String,
   popularity: Number,
   slug: String,
   is_active: Boolean,
}

module.exports = router
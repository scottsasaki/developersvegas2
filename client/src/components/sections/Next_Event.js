import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux' // allows connecting redux to this react component
import { store_next_event } from '../../state/next_event'
import { format as format_date } from 'date-fns'
import friendly_format_time from '../../utils/friendly_format_time'
import friendly_format_date from '../../utils/friendly_format_date'

class Next_Event extends Component {
   constructor() {
      super()
      const todays_datetime = format_date(new Date(), 'yyyyMMddkkmm')

      axios
         .get(`/api/v1/events?occurs=after&date=${todays_datetime}`) // recall we put a PROXY value in our client package.json
         .then(res => {
            console.log(res.data)
            this.props.store_next_event(res.data)
         })
         .catch(err => console.log({ errors: err.response.data }))
   }

   render() {
      const {
         _id,
         title,
         started_on,
         ended_on,
         location_name,
         location_street_1,
         location_street_2,
         location_city,
         location_state,
         location_zip,
         location_url,
         cost,
         description,
      } = this.props.stored_next_event

      const trim_time = datetime => {
         if (datetime) {
            return String(datetime).slice(-4)
         }
      }

      return (
         <div>
            <h3 className="mb-1">Next event</h3>
            <hr className="mt-0" />
            <div className="row">
               <div className="col-md-6"></div>
               <div className="col-md-6" key={_id}>
                  <h4>
                     {title} - {friendly_format_date(started_on)}
                  </h4>
                  <div className="row">
                     <div className="col-2">
                        <p>Time:</p>
                     </div>
                     <div className="col-10">
                        <p>
                           <span className="text-capitalize">
                              {friendly_format_time(trim_time(started_on))}
                           </span>
                           &nbsp;to&nbsp;
                           {friendly_format_time(trim_time(ended_on))}
                        </p>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-2">
                        <p>Place:</p>
                     </div>
                     <div className="col-10">
                        <p>
                           <a
                              href={location_url}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              {location_name}
                              <br />
                              {location_street_1}
                              {location_street_2 && (
                                 <span>
                                    <br />
                                    {location_street_2}
                                 </span>
                              )}
                              <br />
                              {location_city}, {location_state} {location_zip}
                           </a>
                        </p>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-2">
                        <p>Cost:</p>
                     </div>
                     <div className="col-10">
                        <p>{cost}</p>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-2">
                        <p>Details:</p>
                     </div>
                     <div className="col-10">
                        <p className="text-justify">{description}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="clearfix"></div>
         </div>
      )
   }
}

const map_store_to_props = store => {
   // so I can use stored values as props
   // https://stackoverflow.com/a/38678454
   return {
      stored_next_event: store.next_event,
   }
}
export default connect(
   map_store_to_props, // mapStateToProps
   { store_next_event } // mapDispatchToProps, here an 'action creator' wrapped in an object
)(withRouter(Next_Event))

import React from 'react'
import { FormErrors } from './FormErrors'
import { passCsrfToken } from '../utils/helpers'
import { Form, Dropdown, Table, Col, Button } from 'react-bootstrap';
import axios from 'axios'
import { GET_RATES, GET_ADMIN_RATES, POST_ADMIN_RATE } from '../constants/constants'

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin_data: [],
      rate: '',
      datetime: '',
      rate_name: 'AED',
      is_done: false,
      formValid: false,
      rateValid: false,
      datetimeValid: false,
      formErrors: {rate: '', datetime: ''},
      rates: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get_admin_json() {
    axios.get(GET_ADMIN_RATES)
    .then(response => {
      this.setState({admin_data: response.data.data});
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    passCsrfToken(document, axios)

    axios.get(GET_RATES)
    .then(response => {
      this.setState({rates: response.data})
    })
    .catch(error => console.log(error))
    return this.get_admin_json()
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let rateValid = this.state.rateValid;
    let datetimeValid = this.state.datetimeValid;

    switch(fieldName) {
        case 'datetime':
          datetimeValid = value.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/);
          fieldValidationErrors.datetime = datetimeValid ? '' : ' is invalid';
          break;
        case 'rate':
          rateValid = value.match(/^[0-9]+(\.[0-9]{1,2})?/);
          fieldValidationErrors.rate = rateValid ? '': ' is not a number';
          break;
        default:
          break;
      }
    this.setState({formErrors: fieldValidationErrors,
      datetimeValid: datetimeValid,
      rateValid: rateValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.rateValid &&
    this.state.datetimeValid});
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { rate, datetime, rate_name } = this.state
    axios.post(POST_ADMIN_RATE, { rate, datetime, rate_name })
    .then((response) => {
      if(response.data) {
        this.setState({is_done: true});
        this.props.updateData(this.state.is_done);
        return this.get_admin_json()
      }
    })
    this.setState({ rate: '', datetime: '', rate_name: 'AED', is_done: false})
  }

  render() {
    const value1 = Object.values(this.state.rates);
    const value2 = value1[0]
    var cname = []
    const data1 = Object.values(this.state.admin_data);
    const data2 = this.state.admin_data.data
    if (value2){ value2.map((k) => {
      return (
        cname.push(k[0])
      )
    })}
    return (
      <React.Fragment>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <h1 align="center">Admin panel</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    Select rate
                  </th>
                  <th>
                    New Rate
                  </th>
                  <th>
                    Date and time format: (2013-02-02 01:00:00)
                  </th>
                  <th>
                    Confirm changes
                  </th>
                </tr>
              </thead>
                <tbody>
                  <tr>
                    <td>
                      <select as="select" name="rate_name" value={this.state.rate_name} onChange={this.handleChange}>
                          {cname.map((n) => {
                            return (
                              <option key={n}>{n}</option>
                            )
                          })}
                      </select>
                      <FormErrors formErrors={this.state.formErrors} />
                    </td>
                    <td>
                      <input type="text" name="rate" value={this.state.rate} onChange={this.handleChange} placeholder="Enter new rate..." />
                    </td>
                    <td>
                      <input type="text" name="datetime" value={this.state.datetime} onChange={this.handleChange} placeholder="Enter date and time..." />
                    </td>
                    <td align="center">
                      <Button variant="dark" type="submit"  disabled={!this.state.formValid}>
                        Submit
                      </Button>
                    </td>
                  </tr>
                </tbody>
            </Table>
          </Form>
          <div>
            <Form>
              <Table>
                <thead>
                  <tr>
                    <th colSpan="2">Last changes</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.admin_data.map((i,j) => {
                    return (
                      <React.Fragment key = {j}>
                        <tr>
                        <td> {i.rate_name} Rate: {i.rate} </td>
                        <td> {i.datetime} </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </Table>
            </Form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Admin

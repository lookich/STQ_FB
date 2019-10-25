import React from 'react'
import { FormErrors } from './FormErrors'
import { passCsrfToken } from '../utils/helpers'
import { Form, Dropdown, Table, Alert, Col, Button } from 'react-bootstrap';
import axios from 'axios'

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
    axios.get(`http://localhost:3000/admin.json`)
    .then(response => {
      this.setState({admin_data: response.data.data});
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    passCsrfToken(document, axios)

    axios.get('http://localhost:3000/rate/rates.json')
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
    // console.log(this.state.is_done)
    axios.post(`http://localhost:3000/admin`, { rate, datetime, rate_name })
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
            <Form.Row className="justify-content-md-center">
              <Alert variant="success">
                <Alert.Heading>Admin panel</Alert.Heading>
              </Alert>
            </Form.Row>
            <Form.Row className="justify-content-md-center">
              <Col md="2">
                <Form.Group>
                  <Form.Label>Сurrency:</Form.Label>
                  <Dropdown>
                    <Form.Control as="select" name="rate_name" value={this.state.rate_name} onChange={this.handleChange}>
                      {cname.map((n) => {
                        return (
                          <option key={n}>{n}</option>
                        )
                      })}
                    </Form.Control>
                  </Dropdown>
                </Form.Group>
                <FormErrors formErrors={this.state.formErrors} />

              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Label>New Rate</Form.Label>
                  <Form.Control type="text" name="rate" value={this.state.rate} onChange={this.handleChange} placeholder="Enter new rate..." />
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group>
                  <Form.Label>Date and time format: (2013-02-02 01:00:00)</Form.Label>
                  <Form.Control type="text" name="datetime" value={this.state.datetime} onChange={this.handleChange} placeholder="Enter date and time..." />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row className="justify-content-md-center">
              <Button variant="dark" type="submit"  disabled={!this.state.formValid}>
                Submit
              </Button>
            </Form.Row>
          </Form>
          <div>
            <Form>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Base rate: USD</th>
                    <th>Date and time last chages</th>
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

import React from 'react'
import axios from 'axios'
import { Form, Table } from 'react-bootstrap';
import { GET_RATES } from '../constants/constants'

class ExchangeRate extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rates: []
    };
  }

  get_rates_json () {
    axios.get(GET_RATES)
    .then(response => {
      this.setState({rates: response.data})
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    return this.get_rates_json()
  }

  render() {
    var is_done = new Boolean(false);
    const value = Object.values(this.state.rates);
    const values = value[0]

      var is_done = localStorage.getItem('is_done');
      if (is_done === true) {
        this.get_rates_json()
      }

    if (values) {
      return (
        <React.Fragment>
          <div>
            <Form>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Base rate:
                      USD
                    </th>
                    <th>Date and time last chages</th>
                  </tr>
                </thead>
                <tbody>
                    {values.map((i) => {
                      return (
                        <React.Fragment key={i}>
                          <tr>
                            <td> Exchange rate: {i[0]} </td>
                            <td> {i[1]} </td>
                          </tr>
                        </React.Fragment>
                      )
                    })}
                </tbody>
              </Table>
            </Form>
          </div>
        </React.Fragment>
      )
    } else
    {return null}
  }
}

export default ExchangeRate

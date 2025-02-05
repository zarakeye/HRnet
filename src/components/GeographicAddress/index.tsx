import React from 'react'
import type { Employee, GeographicAddress } from '../../common/types'
import states from '../../components/GeographicAddress/states.json'

interface State {
  name: string
  abbreviation: string
}

interface GeographicAddressProps {
  formData: GeographicAddress
  setFormData: React.Dispatch<React.SetStateAction<Employee>>
}

const GeographicAddress: React.FC<GeographicAddressProps> = ({formData, setFormData}): JSX.Element => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  return (
    <fieldset className="address">
      <legend>Address</legend>

      <label htmlFor="street">Street</label>
      <input id="street" type="text" value={formData.street} onChange={handleChange}/>

      <label htmlFor="city">City</label>
      <input id="city" type="text" value={formData.city} onChange={handleChange}/>

      <label htmlFor="state">State</label>
      <select id="state" value={formData.state} onChange={handleChange}>
        {states.map((state: State, index: number) => (
          <option key={index} value={state.name}>{state.name}</option>
        ))}
      </select>

      <label htmlFor="zip-code">Zip Code</label>
      <input id="zip-code" type="text" value={formData.zipCode} onChange={(e) => setFormData(prev => ({...prev, zipCode: e.target.value}))}/>
    </fieldset>
  )
}

export default GeographicAddress;
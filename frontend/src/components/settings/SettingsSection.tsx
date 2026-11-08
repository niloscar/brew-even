import { useState } from 'react'

import { SETUP_PART_OPTIONS } from '../../settings/constants'
import NumberStepperInput from '../NumberStepperInput'

import type { Currency } from 'shared'

export default function SettingsSection({ currency }: { currency: Currency }) {
  const [partPrice, setPartPrice] = useState(0)

  return (
    <section className="view" id="settings">
      <h2>Settings</h2>

      <div className="cardGrid col2">
        <section className="card">
          <h3>Manage setup</h3>

          <form 
            className="formGrid" 
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="setupPart">Part of setup</label>
            <select id="setupPart" name="setupPart">
              {SETUP_PART_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="partPrice">Price</label>
            <NumberStepperInput
              id="partPrice"
              label="Part price"
              value={partPrice}
              onChange={setPartPrice}
              step={0.01}
              unit={currency}
            />

            <label htmlFor="partAcquisitionDate">Acquisition date</label>
            <input
              type="date"
              id="partAcquisitionDate"
              name="partAcquisitionDate"
            />

            <button type="submit">Add</button>
          </form>
        </section>

        <section className="card">
          <h3>Connect your coffee setup</h3>
          
          <p>Connect your coffee setup to the app to automatically track and calculate your costs.</p>
          <p>Once connected, the app will automatically update your costs based on your usage.</p>

          <form 
            className="formGrid"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="supplier">Supplier</label>
            <select id="supplier" name="supplier">
              <option value="laMarzocco">La Marzocco</option>
            </select>

            <label htmlFor="apiKey">API key</label>
            <input type="text" id="apiKey" name="apiKey" />

            <button type="submit">Connect</button>
          </form>
        </section>
      </div>
    </section>
  )
}

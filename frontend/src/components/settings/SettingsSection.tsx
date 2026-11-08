import { PlugsIcon } from '@phosphor-icons/react'


export default function SettingsSection() {
  return (
    <section className="view" id="settings">
      <h2>Settings</h2>

      <div className="cardGrid col1">
        <section className="card">
          <h3>
            <PlugsIcon />
            <span>Connect your coffee setup</span>
          </h3>

          <p>Connect your coffee setup to the app to automatically track and calculate your costs.</p>
          <p>Once connected, the app will automatically update your costs based on your usage.</p>

          <form 
            className="formGrid"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="supplier">Supplier</label>
            <select 
              className="buttonLike"
              id="supplier" 
              name="supplier"
            >
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

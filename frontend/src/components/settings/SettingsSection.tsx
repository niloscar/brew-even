import CoffeeIntegrationForm from './CoffeeIntegrationForm'
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

          <CoffeeIntegrationForm />
        </section>
      </div>
    </section>
  )
}

export default function CoffeeIntegrationForm() {
  return (
    <form className="formGrid" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="supplier">Supplier</label>
      <select className="buttonLike" id="supplier" name="supplier">
        <option value="laMarzocco">La Marzocco</option>
      </select>

      <label htmlFor="apiKey">API key</label>
      <input type="text" id="apiKey" name="apiKey" />

      <button type="submit">Connect</button>
    </form>
  )
}

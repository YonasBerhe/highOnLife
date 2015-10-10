import Config from './locals'
import Playfab from './playfabAPI'

Playfab.settings.title_id = Config.playfab.title_id
Playfab.settings.developer_secret_key = Config.playfab.developer_secret_key

export default Playfab

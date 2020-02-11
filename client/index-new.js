import domready from 'domready'
import { getApi } from 'resolve-api'

const main = async resolveContext => {
  await new Promise(resolve => domready(resolve))
  const api = getApi(resolveContext)

  const sendMessage = (userName, message) =>
    api.command(
      {
        aggregateName: 'Chat',
        type: 'postMessage',
        aggregateId: userName,
        payload: message
      },
      err => {
        if (err) {
          console.warn(`Error while sending command: ${err}`)
        }
      }
    )

  initUI(sendMessage)

}

export default main

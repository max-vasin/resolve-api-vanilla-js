import domready from 'domready'
import { getApi } from 'resolve-api'
import initUI from './init_ui'

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

  let chatViewModelState = window.__INITIAL_STATE__.chat

  initUI(chatViewModelState, sendMessage)

  const callback1 = event => {
    console.log('1: --- topic event', event)
    return event
  }
  api.subscribeTo('chat', '*', callback1)
}

export default main

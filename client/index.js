import domready from 'domready'
import { getApi } from 'resolve-api'
import initUI from './init_ui'
import updateUI from './update_ui'

const main = async resolveContext => {
  await new Promise(resolve => domready(resolve));
  const { viewModels } = resolveContext;
  const chatViewModel = viewModels.find(({ name }) => name === "chat");
  const api = getApi(resolveContext);

  const sendMessage = (userName, message) =>
    api.command(
      {
        aggregateName: "Chat",
        type: "postMessage",
        aggregateId: userName,
        payload: message
      },
      err => {
        if (err) {
          console.warn(`Error while sending command: ${err}`)
        }
      }
    );

  let chatViewModelState = window.__INITIAL_STATE__.chat

  initUI(chatViewModelState, sendMessage)

  const chatViewModelUpdater = event => {
    const eventType = event != null && event.type != null ? event.type : null
    const eventHandler = chatViewModel.projection[eventType]

    if (typeof eventHandler === "function") {
      chatViewModelState = eventHandler(chatViewModelState, event)
    }

    setImmediate(updateUI.bind(null, chatViewModelState))
  }

  api.subscribeTo("chat", "*", chatViewModelUpdater)
}

export default main;

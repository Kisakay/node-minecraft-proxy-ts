function handleCommands(client: { on: (arg0: string, arg1: (data: { message: string }, metadata: any) => void) => void; id: any; write: (arg0: string, arg1: { message: string; position: number }) => void }, proxy: { serverList: { [x: string]: any }; setRemoteServer: (arg0: any, arg1: string) => void }, localServerOptions: any, proxyOptions: any) {
  client.on('chat', (data: { message: string }, metadata: any) => {
    let split = data.message.split(' ')
    if (split[0] === '/server') {
      if (proxy.serverList[split[1]]) {
        proxy.setRemoteServer(client.id, split[1])
      } else {
        const msg = {
          color: 'red',
          translate: 'commands.generic.selector_argument',
          with: [
            split[1]
          ]
        }
        client.write('chat', { message: JSON.stringify(msg), position: 0 })
      }
    }
  })
}

export = handleCommands;
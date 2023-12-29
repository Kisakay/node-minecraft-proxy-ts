const mc = require('minecraft-protocol')

function addListeners(remoteClient: { isFirstConnection: any; on: (arg0: string, arg1: (data: any, metadata: any) => void) => void; localClient: { state: any; write: (arg0: any, arg1: any) => void; on: (arg0: string, arg1: { (data: any, metadata: any): void; (data: any, metadata: { name: any }): void }) => void }; state: any; write: (arg0: any, arg1: any) => void; currentServer: any; id: any }, that: { getFallbackServerName: () => any; fallback: (arg0: any) => void }) {
  if (remoteClient.isFirstConnection) {
    remoteClient.on('packet', (data, metadata) => {
      if (remoteClient.localClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {
        remoteClient.localClient.write(metadata.name, data)
      }
    })
  }

  remoteClient.localClient.on('packet', (data, metadata) => {
    if (metadata.name === 'kick_disconnect') return
    if (remoteClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {
      remoteClient.write(metadata.name, data)
    }
  })

  remoteClient.localClient.on('kick_disconnect', (data: any, metadata: { name: any }) => {
    if (that.getFallbackServerName() === remoteClient.currentServer) {
      remoteClient.write(metadata.name, data)
    } else {
      that.fallback(remoteClient.id)
    }
  })
}

export = addListeners

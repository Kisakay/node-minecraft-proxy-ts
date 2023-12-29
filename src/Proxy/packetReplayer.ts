const Queue = require('queuejs')

function replayer(remoteClient: { write: (arg0: string, arg1: { dimension: any; difficulty: any; gamemode: any; levelType: any }) => void }, localClient: { on: (arg0: string, arg1: { (data: any, metadata: any): void; (data: any, metadata: any): void }) => void }, callback: () => void) {
  let packets = new Queue()
  let sentRespawn = false

  localClient.on('packet', (data, metadata) => {
    if (!sentRespawn) {
      packets.enq({
        packet: data,
        metadata: metadata
      })
    }
  })

  localClient.on('login', (data, metadata) => {
    sentRespawn = true
    remoteClient.write('respawn', {
      dimension: data.dimension,
      difficulty: data.difficulty,
      gamemode: data.gameMode,
      levelType: data.levelType
    })

    while (packets.size > 0) {
      let element = packets.deq()
      remoteClient.write(element.metadata.name, element.packet)
    }

    callback()
  })
}

export = replayer

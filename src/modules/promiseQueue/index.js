export function createQueue() {
    const queue = []
    let flushing = false

    function enqueue(promise, resolve, reject) {
        queue.push({promise, resolve, reject})
        if (!flushing) {
            return flushQueue()
        } else {
            return Promise.resolve()
        }
    }

    function flushQueue() {
        flushing = true
        const chain = () => {
            const nextTask = queue.shift()
            if (nextTask) {
                let p = new Promise(nextTask.promise)
                if (nextTask.resolve) {
                    p = p.then(nextTask.resolve)
                }
                if (nextTask.reject) {
                    p = p.catch(nextTask.reject)
                }
                return p.then(() => {
                    chain()
                })
            } else {
                flushing = false
            }
        }
        return Promise.resolve(chain())
    }

    return {
        enqueue
    }
}
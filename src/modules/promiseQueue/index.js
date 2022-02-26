export function Queue() {
    this.queue = []
    this.flushing = false
    this.enqueue = function (executor) {
        const p = new Promise((resolve, reject) => {
            this.queue.push(new Task(executor, resolve, reject))
        })
        if (!this.flushing) {
            this.flushing = true
            chain()
        }
        return p
    }

    const chain = () => {
        const nextTask = this.queue.shift()
        if (nextTask) {
            return nextTask.execute().finally(() => {
                chain()
            })
        } else {
            this.flushing = false
        }
    }
}

function Task(executor, resolve, reject) {
    this.execute = () => {
        return new Promise(executor).then(resolve).catch(reject)
    }
}
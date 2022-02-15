export function Queue() {
    this.queue = []
    this.flushing = false
    this.enqueue = function (task) {
        this.queue.push(task)
        if (!this.flushing) {
            this.flushing = true
            return Promise.resolve(chain())
        } else {
            return Promise.resolve()
        }
    }

    const chain = () => {
        const nextTask = this.queue.shift()
        if (nextTask) {
            return nextTask.execute().then(() => {
                chain()
            })
        } else {
            this.flushing = false
        }
    }
}

export function Task(executor, resolve, reject) {
    this.executor = executor
    this.resolve = resolve
    this.reject = reject
    this.execute = function () {
        let p = new Promise(this.executor)
        if (this.resolve) {
            p = p.then(this.resolve)
        }
        if (this.reject) {
            p = p.catch(this.reject)
        }
        return p
    }
}
export interface ResolveCallback<T> {
    (value: T | PromiseLike<T>): void
}

export interface RejectCallback {
    (reason?: any): void
}

export interface Executor<T> {
    (resolve: ResolveCallback<T>, reject: RejectCallback): void
}

interface Task<T> {
    executor: Executor<T>
    resolve: ResolveCallback<T>
    reject: RejectCallback
}

export class Queue {
    queue: Task<any>[] = []
    flushing: boolean = false

    enqueue<T>(executor: Executor<T>): Promise<T> {
        const p = new Promise((resolve: ResolveCallback<T>, reject: RejectCallback) => {
            this.queue.push({executor, resolve, reject})
        })
        if (!this.flushing) {
            this.flushing = true
            this.chain()
        }
        return p
    }

    chain(): void {
        const nextTask = this.queue.shift()
        if (nextTask) {
            new Promise(nextTask.executor).then(nextTask.resolve).catch(nextTask.reject).finally(() => {
                this.chain()
            })
        } else {
            this.flushing = false
        }
    }
}
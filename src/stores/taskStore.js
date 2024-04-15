import { defineStore } from "pinia";

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        tasks: [],
        isLoading: false
    }),
    getters: {
        favs() {
            return this.tasks.filter(task => task.isFav);
        },
        favCount() {
            return this.tasks.reduce((p, c) => {
                return c.isFav ? p + 1 : p;
            }, 0);
        },
        totalCount: (state) => {
            return state.tasks.length;

        }
    },
    actions: {
        async getTasks() {
            this.isLoading = true;
            const resp = await fetch('http://localhost:3000/tasks')
            const data = await resp.json();

            this.tasks = data;
            this.isLoading = false;
        },
        async addTask(task) {
            this.tasks.push(task);

            const resp = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });

            if (resp.error)
                console.log(resp.error);
        },
        async deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            const resp = await fetch('http://localhost:3000/tasks/' + id, {
                method: 'DELETE'
            });

            if (resp.error)
                console.log(resp.error);
        },
        async toggleFav(id) {
            const task = this.tasks.find(t => t.id === id);
            task.isFav = !task.isFav;

            const resp = await fetch('http://localhost:3000/tasks/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isFav: task.isFav })
            });

            if (resp.error)
                console.log(resp.error);
        }
    }
})
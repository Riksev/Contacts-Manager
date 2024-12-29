import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const requestURL = '/api'

const app = createApp({
    data() {
        return {
            loading: false,
            form: {
                name: '',
                phone: ''
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.phone.trim() && this.form.name.trim()
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form
            const newContact = await request(requestURL + '/contacts', 'POST', contact)
            console.log(newContact)
            this.contacts.push(newContact)
            this.form.name = this.form.phone = ''
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(requestURL + `/contacts/${id}`, 'PUT', {
                ...contact,
                marked: !contact.marked
            })
            contact.marked = updated.marked
        },
        async removeContact(id) {
            await request(requestURL + `/contacts/${id}`, 'DELETE')
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    async mounted() {
        this.loading = true
        this.contacts = await request(requestURL + '/contacts', 'GET')
        this.loading = false
    }
})

app.component('loader', {
    template: `
    <div class="col-8" style="display: flex; justify-content: center; align-items: center;">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
})

app.mount('#app')

async function request(url, method, data = null) {
    try {
        const headers = {}
        let body
        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch(e) {
        console.warn('Помилка:', e.message)
    }
}
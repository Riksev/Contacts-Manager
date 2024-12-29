const express = require('express');
const path = require('path');
const app = express();
const {v4} = require('uuid')

let CONTACTS = [
    {
        id: v4(),
        name: 'Голубович Євгеній',
        phone: '+380661234567',
        marked: false
    }
]

app.use(express.json());

const requestURL = '/api'

// GET
app.get(requestURL + '/contacts', (req, res) => {
    setTimeout(() => {
        res.status(200).json(CONTACTS)
    }, 1000)
})

// POST
app.post(requestURL + '/contacts', (req, res) => {
    const contact = {...req.body, id: v4(), marked: false}
    CONTACTS.push(contact)
    res.status(201).json(contact)
})

// DELETE
app.delete(requestURL + '/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
    res.status(200).json({message: 'Контакт було успішно видалено'})
})

// PUT
app.put(requestURL + '/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id)
    CONTACTS[idx] = req.body
    res.json(CONTACTS[idx])
})

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
})

app.listen(3000, () => console.log('Сервер працює на порті 3000...'));
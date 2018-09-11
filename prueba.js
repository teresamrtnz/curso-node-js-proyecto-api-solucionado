const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27005/test')

const Cat = mongoose.model('Cat', { name: String })

const kitty = new Cat({ name: 'Zildjian' })
kitty.save().then(() => console.log('meow'))

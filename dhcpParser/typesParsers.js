const _ = require('lodash')

const TypeParser = require('./TypeParserClass')

const dictionary = {
    uInt8: {
        serialize: number => Buffer.alloc(1).writeUInt8(number),
        deserialize: buffer => buffer.readUInt8(),
        size: 1 
    },
    uInt16: {
        serialize: number => Buffer.alloc(2).writeUInt16BE(number),
        deserialize: buffer => buffer.readUInt16BE(),
        size: 2
    },
    utf8: {
        serialize: string => Buffer.alloc(1).write(string),
        deserialize: buffer => buffer.toString('utf8'),
        size: 1
    },
    ipv4: {
        serialize: ip => {
            const parsedOctets = string.split('.').map(parseInt)
            return Buffer.alloc(4).writeUInt8(parsedOctets)
        },
        deserialize: buffer => {
            let arrayToFill = Array(4).fill()
            const listOfOctets = arrayToFill.map((value, index) => Buffer.readUInt8(index))
            return listOfOctets.join('.')
        },
        size: 4
    },
    end: {
        serialize: () => Buffer.alloc(0),
        deserialize: () => null,
        size: 0
    }
}


//We convert data to instances of TypeParser before exporting
const dictionaryOfTypeParsers = _.mapValues(dictionary, entry => new TypeParser(entry))

module.exports = dictionaryOfTypeParsers
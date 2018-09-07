const dhcpOptions = require('./dhcpOptions')
const DhcpOption = require('./DhcpOptionClass')
const dhcpResolver = require('./dhcpResolver')

const END_OPTION_NUMBER = 255
const METADATA_PAYLOAD_SIZE = 2

function getOptions(buffer) {
    const result = getNextOption(buffer)
    return result
}

function getNextOption(buffer, offset = 0, accumulatedOptions = {}) {
    const optionNumber = DhcpOption.parseOptionNumber(buffer.slice(offset))
    if (!dhcpOptions[optionNumber]) return handleUnknownDhcpProperty(buffer, offset, accumulatedOptions, optionNumber)
    const optionName = dhcpOptions[optionNumber].name
    if (optionNumber === END_OPTION_NUMBER)
        return Object.assign({}, accumulatedOptions, {[optionName]: {}})

    const relatedBufferSlice = DhcpOption.getBufferSlice(buffer.slice(offset))
    const retrievedProperties = dhcpOptions[optionNumber].parse(relatedBufferSlice)
    const newAccumulatedOptions = Object.assign({}, accumulatedOptions, {[optionName]: retrievedProperties})
    const newOffset = offset + METADATA_PAYLOAD_SIZE + DhcpOption.parseOptionSize(relatedBufferSlice)
    return getNextOption(
        buffer,
        newOffset,
        newAccumulatedOptions
    )
}

function handleUnknownDhcpProperty(buffer, offset, accumulatedOptions = {}, optionNumber) {
    dhcpResolver(optionNumber)
        .then(optionName => {
            console.error(`Unknown DHCP option ID: ${optionNumber}, resolved as: ${optionName}`)
        })
        .catch(err => {
            console.error(`Unknown DHCP option ID: ${optionNumber}, Kricco was unable to resolve the name`)
        })
    
    const relatedBufferSlice = DhcpOption.getBufferSlice(buffer.slice(offset))
    DhcpOption.parseOptionSize(relatedBufferSlice)
    const newOffset = offset + METADATA_PAYLOAD_SIZE + DhcpOption.parseOptionSize(relatedBufferSlice)
    return getNextOption(
        buffer,
        newOffset,
        accumulatedOptions
    )
}

module.exports = {getOptions}
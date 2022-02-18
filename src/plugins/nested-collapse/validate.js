const validate = (items, ids = []) => {
    const _str = obj => JSON.stringify(obj);
    if (!(items && Array.isArray(items)))
        throw Error('Invalid Menu Item. Must be an Array')
    if (items.length === 0)
        return console.warn('You need at leat 1 menu item to create Collapsible Manu. None provided')
    for (let item of items) {
        let id =item.id;
        if (!id)
           throw Error('All items must have a unique id property, Trace: ' + _str(item))
        else{
            if(typeof id !== 'string' || !id.match(/^[_a-z]/))
               throw Error('\'id\' is required for every field and must start with a letter or underscore (_). Trace: ' + _str(item));
            if(ids.includes(id))
               throw Error('Same \'id\' have been detected between collapsible items. Please use unique \'id\'. Trace: ' + _str(item))
            ids.push(id)
        }
        if (typeof item !== 'object')
            throw Error('Invalid Menu Item found.')
        const keys = Object.keys(item);
        if (!keys.includes('label'))
            throw Error('All menu items must have a label property, Trace: ' + _str(item))
        if (!keys.includes('children') && !keys.includes('href'))
            throw Error('All menu items without children must have href property, Trace: ' + _str(item))
        if (keys.includes('children') && (!Array.isArray(item.children) || item.children.length == 0))
            throw Error('children property must be an array with at least 1 value, Trace: ' + _str(item))
        if (keys.includes('children'))
            validate(item.children, ids);
    }
}

export default validate;
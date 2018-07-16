/**
 * @module
 */


/**
 * @class Stack
 */
export default class Stack {


    /**
     * @constructor
     * @param items
     */
    constructor(...items){
        this.map = new WeakMap();
        this._items = [];

        // let's store our items array inside the weakmap
        this.map.set(this, []);
        // let's get the items array from map, and store it in _items for easy access elsewhere
        this._items = this.map.get(this);

        //if constructor receives any items, it should be stacked up
        if(items.length>0)
            items.forEach(item => this._items.push(item))
    }


    /**
     *
     * @param items
     * @returns {Stack}
     */
    push(...items){
        //push item to the stack
        items.forEach(item => this._items.push(item));
        return this;

    }

    /**
     *
     * @param count
     * @returns {Stack}
     */
    pop(count=0){
        //pull out the topmost item (last item) from stack
        if(count===0)
            this._items.pop();
        else
            this._items.splice( -count, count );
        return this
    }


    /**
     *
     * @returns {*}
     */
    peek(){
        // see what's the last item in stack
        return this._items[this._items.length-1]
    }

    /**
     *
     * @returns {number}
     */
    size(){
        //no. of items in stack
        return this._items.length;
    }

    /**
     *
     * @returns {boolean}
     */
    isEmpty(){
        // return whether the stack is empty or not
        return this._items.length===0;
    }

    /**
     *
     * @returns {Array|*}
     */
    toArray(){
        // return items of the queue
        return this._items;
    }
}

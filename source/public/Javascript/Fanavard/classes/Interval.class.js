class Interval {

    constructor() {
        //to keep a reference to all the intervals
        this.intervals = {};
    }


    //create another interval
    make( usedFunction , delay ) {
        //see explanation after the code
        let newInterval = setInterval.apply(
            window,
            [ usedFunction , delay ].concat( [].slice.call(arguments, 2) )
        );

        this.intervals[ newInterval ] = true;

        return newInterval;
    }

    //clear a single interval
    clear( id ) {
        return clearInterval(id);
    }

    //clear all intervals
    clearAll() {
        let all = Object.keys( this.intervals ), len = all.length;

        while ( len --> 0 ) {
            clearInterval( all.shift() );
        }
    }
}

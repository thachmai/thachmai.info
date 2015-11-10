'use strict';

function earth() {
    var location;

    function me() {
    }

    me.location = function (value) {
        if (typeof value === 'undefined') return location;

        location = value;
        return me;
    };

    return me;
}

import React, {Component} from 'react';

/**
 * Timing utils class for handling player timing
 */
export default class Timing {
    // Padding for the physical position may need to be updated
    pad = (n, width, z=0) => {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(String(z)) + n;
    }
  
    // TODO This conversion may not be working
    minutesAndSeconds = (position) => ([
        this.pad(Math.floor(position / 60), 2),
        this.pad(position % 60, 2),
    ]);
}
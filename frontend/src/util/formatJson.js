/*
* @Author: inksmallfrog
* @Date:   2017-08-10 10:49:01
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-11 13:23:02
*/

'use strict';
import dateFormat from 'dateformat';

export default function(){
  Date.prototype.toJSON=function(){
    return dateFormat(this, 'yyyy-mm-dd');
  }
}

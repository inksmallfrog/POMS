/*
* @Author: inksmallfrog
* @Date:   2017-08-13 10:20:58
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-08-17 14:51:04
*/

'use strict';
import dateFormat from 'dateformat';

/*export default function(){
  return dateFormat(this, 'yyyy-mm-dd');
}*/
export default function(date){
  if(date instanceof Date){
    let month = date.getMonth() + 1;
    if(month < 10){
      month = `0${month}`;
    }
    let day = date.getDate();
    if(day < 10){
      day = `0${day}`;
    }
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

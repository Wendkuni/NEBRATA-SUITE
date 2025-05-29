

export class GlobalDateConverter {


    private static _localDateFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    private static _localDateTimeFormat = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;


      static  toNativeDate(format,value) : Date{
      
        const [,day, month,year,hour,minute,seconde] = format.exec(value);
        let date;
        if(hour)
         date = new Date(parseInt(year,10), parseInt(month,10)-1, parseInt(day,10),parseInt(hour,10),parseInt(minute,10),parseInt(seconde,10));
        else 
         date = new Date(parseInt(year,10), parseInt(month,10)-1, parseInt(day,10));
        return date;  
    }
    static convertToDate(body, dateKeys:string[]) {
        if (body === null || body === undefined) {
            return body;
        }
        if (typeof body !== 'object') {
            return body;
        }
        for (const key of Object.keys(body)) {
            const value = body[key];
            if (typeof value === 'object' && value) {
                this.convertToDate(value,dateKeys);
            }else {
                if(dateKeys.indexOf(key)>=0) {
                   
                    if (this.islocalDateTime(value)) {
                        body[key] = this.toNativeDate(this._localDateTimeFormat,value);
                    } else if (this.islocalDate(value)) {
                        body[key] = this.toNativeDate(this._localDateFormat,value);
                    }
                }
            }
   
        }
    }

    static   islocalDate(value) {
        if (value === null || value === undefined) {
            return false;
        }
        return this._localDateFormat.test(value);
    }
    static islocalDateTime(value) {
        if (value === null || value === undefined) {
            return false;
        }
        return this._localDateTimeFormat.test(value);
    }
}
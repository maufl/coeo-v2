interface EventMap {
  [key: string]: Array<Function>
}

export class EventEmitter {
  _events: EventMap;

  on(event: string, fct: Function) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  }

  emit(event: string, ...args: any[]) {
    this._events = this._events || {};
    if( event in this._events === false ) return;
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
}

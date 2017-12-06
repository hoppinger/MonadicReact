import * as Immutable from "immutable"

class TupleMap<K,V> {
    private _cache: Immutable.Map<string, V>
    private _idMap: Immutable.Map<any, string>
    private _id: number
    private _lastTuple: any
    private _lastHash: string
    private _limit?: number

    public constructor(limit?: number) {
        this._limit = limit;          
        this.clear();
    }

    private _hash( key: K ): string {
        // Speed up hash generation for the folowing pattern:
        // if ( !cache.has(t) ) { cache.set( t, slowFn(t) ); }
        if ( key === this._lastTuple ) {
          return this._lastHash;
        }
    
        let l = 1;
        if ("length" in key) {
            l = (key as any).length;
        }
        let hash: string[] = [];
    
        for ( let i = 0; i < l; i++ ) {
          const arg = key[i];
          const argType = typeof arg;
    
          // if the argument is not a primitive, get a unique (memoized?) id for it
          // (typeof null is "object", but should be considered a primitive)
          if ( arg !== null && ( argType === 'object' || argType === 'function' ) ) {
            if ( this._idMap.has( arg ) ) {
              hash.push( this._idMap.get(arg) );
            } else {
              const id = '#' + this._id++;
              this._idMap.set( arg, id );
              hash.push( id );
            }
    
          // otherwise, add the argument and its type to the hash
          } else {
            hash.push( argType === 'string' ? '"' + arg + '"' : '' + arg );
          }
        }
    
        this._lastTuple = key;
        // concatenate serialized arguments using a complex separator
        // (to avoid key collisions)
        this._lastHash = hash.join('/<[MI_SEP]>/');
    
        return this._lastHash;
    }

    public has(key: K): boolean {
        const hash = this._hash( key );
        return this._cache.has( hash );
    }

    public get(key: K, default_val: V): V
    {
        const hash = this._hash( key );
        if ( this._limit !== undefined && this._cache.has( hash ) ) {
              const value = this._cache.get( hash );
              this._cache.delete( hash );
              this._cache.set( hash, value );
              return value;
        }
        let ret = this._cache.get( hash );        
        return ret != undefined ? ret : default_val
    }

    public set(key: K, value: V): TupleMap<K,V>
    {
        const hash = this._hash( key );
        
            if ( this._limit !== undefined ) {
              this._cache.delete( hash );
            }
        
            this._cache.set( hash, value );
        
            if ( this._limit !== undefined && this._cache.size > this._limit ) {
              this._cache.delete( this._cache.keys().next().value );
            }
        
            return this;
    }

    public count():number {
        return this._cache.count()
    }
    private clear(): void {
        this._cache = Immutable.Map();
        this._idMap = Immutable.Map();
        this._id = 0;
        //delete this._lastTuple;
        //delete this._lastHash;
    }

}

/*
function TupleMap( opts ) {
    if ( opts && 'limit' in opts ) {
      this._limit = opts.limit;
    }
    this.clear();
  }
  
  TupleMap.prototype = {
    toString: function() {
      return '[object TupleMap]';
    },
    _hash: function( tuple ) {
      // Speed up hash generation for the folowing pattern:
      // if ( !cache.has(t) ) { cache.set( t, slowFn(t) ); }
      if ( tuple === this._lastTuple ) {
        return this._lastHash;
      }
  
      const l = tuple.length;
      let hash = [];
  
      for ( let i = 0; i < l; i++ ) {
        const arg = tuple[i];
        const argType = typeof arg;
  
        // if the argument is not a primitive, get a unique (memoized?) id for it
        // (typeof null is "object", but should be considered a primitive)
        if ( arg !== null && ( argType === 'object' || argType === 'function' ) ) {
          if ( this._idMap.has( arg ) ) {
            hash.push( this._idMap.get(arg) );
          } else {
            const id = '#' + this._id++;
            this._idMap.set( arg, id );
            hash.push( id );
          }
  
        // otherwise, add the argument and its type to the hash
        } else {
          hash.push( argType === 'string' ? '"' + arg + '"' : '' + arg );
        }
      }
  
      this._lastTuple = tuple;
      // concatenate serialized arguments using a complex separator
      // (to avoid key collisions)
      this._lastHash = hash.join('/<[MI_SEP]>/');
  
      return this._lastHash;
    },
  
    has: function( tuple ) {
      const hash = this._hash( tuple );
      return this._cache.has( hash );
    },
  
    set: function( tuple, value ) {
      const hash = this._hash( tuple );
  
      if ( this._limit !== undefined ) {
        this._cache.delete( hash );
      }
  
      this._cache.set( hash, value );
  
      if ( this._limit !== undefined && this._cache.size > this._limit ) {
        this._cache.delete( this._cache.keys().next().value );
      }
  
      return this;
    },
  
    get: function( tuple ) {
      const hash = this._hash( tuple );
  
      if ( this._limit !== undefined && this._cache.has( hash ) ) {
        const value = this._cache.get( hash );
        this._cache.delete( hash );
        this._cache.set( hash, value );
        return value;
      }
  
      return this._cache.get( hash );
    },
  
    clear: function() {
      this._cache = new Immutable.Map();
      this._idMap = new Immutable.Map();
      this._id = 0;
      delete this._lastTuple;
      delete this._lastHash;
    },
  };
  */
  export default TupleMap;
  